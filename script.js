let transacoes = [];

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoSelect = document.getElementById("tipo");
const lista = document.getElementById("lista-transacoes");
const saldo = document.getElementById("saldo");
const totalReceitas = document.getElementById("total-receitas");
const totalDespesas = document.getElementById("total-despesas");
const botaoAdicionar = document.getElementById("adicionar");

let grafico;


botaoAdicionar.addEventListener("click", () => {
  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const tipo = tipoSelect.value;

  if (!descricao || isNaN(valor) || valor <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const transacao = { descricao, valor, tipo };
  transacoes.push(transacao);
  atualizarInterface();
  salvarLocalStorage();

  descricaoInput.value = "";
  valorInput.value = "";
});

function atualizarInterface() {
  atualizarLista();
  atualizarResumo();
  atualizarGrafico();
}

function atualizarLista() {
  lista.innerHTML = "";
  transacoes.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add(t.tipo);
    li.innerHTML = `
      ${t.descricao} - R$ ${t.valor.toFixed(2)}
      <button onclick="removerTransacao(${index})">❌</button>
    `;
    lista.appendChild(li);
  });
}

function atualizarResumo() {
  let receitas = 0;
  let despesas = 0;

  transacoes.forEach(t => {
    if (t.tipo === "receita") receitas += t.valor;
    else despesas += t.valor;
  });

  const saldoFinal = receitas - despesas;

  totalReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
  totalDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
  saldo.textContent = `R$ ${saldoFinal.toFixed(2)}`;
}

function removerTransacao(index) {
  transacoes.splice(index, 1);
  atualizarInterface();
  salvarLocalStorage();
}

function salvarLocalStorage() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function carregarLocalStorage() {
  const dados = localStorage.getItem("transacoes");
  if (dados) {
    transacoes = JSON.parse(dados);
    atualizarInterface();
  }
}


function atualizarGrafico() {
  const receitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const despesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const ctx = document.getElementById("grafico").getContext("2d");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [receitas, despesas],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    },
    options: {
      plugins: { legend: { position: "bottom" } }
    }
  });
}

carregarLocalStorage();
