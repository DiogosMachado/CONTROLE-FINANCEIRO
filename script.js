let saldo = 0;
let movimentacoes = [];
let grafico;

// REFERÊNCIAS
const descricao = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const categoriaSelect = document.getElementById("categoria");

// ================= SALVAR
function salvarDados() {
    localStorage.setItem("saldo", saldo);
    localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
}

// ================= CARREGAR
function carregarDados() {
    saldo = Number(localStorage.getItem("saldo")) || 0;
    movimentacoes =
        JSON.parse(localStorage.getItem("movimentacoes")) || [];

    atualizarTela();
}

// ================= ATUALIZAR TELA
function atualizarTela() {

    const saldoEl = document.getElementById("saldo");
    saldoEl.innerText = saldo.toFixed(2);

    // saldo negativo vermelho
    saldoEl.style.color = saldo < 0 ? "red" : "black";

    const listaReceitas = document.getElementById("listaReceitas");
    const listaGastos = document.getElementById("listaGastos");

    listaReceitas.innerHTML = "";
    listaGastos.innerHTML = "";

    // ORDEM DECRESCENTE
    const listaOrdenada = [...movimentacoes].reverse();

    listaOrdenada.forEach((item, index) => {
        criarItemLista(item, index);
    });

    atualizarGrafico();
}
// ================= ITEM LISTA
function criarItemLista(item, index) {

    const li = document.createElement("li");

    li.innerHTML = `
        <span style="color:${item.cor}">
        ${item.desc} (${item.categoria}) - R$ ${item.valor}
        </span>
        <button class="excluir" onclick="excluirItem(${movimentacoes.length - 1 - index})">X</button>
    `;

    if (item.cor === "green") {
        document.getElementById("listaReceitas").appendChild(li);
    } else {
        document.getElementById("listaGastos").appendChild(li);
    }
}

// ================= RECEITA
function adicionarReceita() {

    const valor = Number(valorInput.value);

    saldo += valor;

    movimentacoes.push({
        desc: descricao.value,
        valor,
        categoria: categoriaSelect.value,
        cor: "green"
    });

    salvarDados();
    atualizarTela();
}

// ================= GASTO
function adicionarGasto() {

    const valor = Number(valorInput.value);

    saldo -= valor;

    movimentacoes.push({
        desc: descricao.value,
        valor,
        categoria: categoriaSelect.value,
        cor: "red"
    });

    salvarDados();
    atualizarTela();
}

// ================= EXCLUIR
function excluirItem(index) {

    const item = movimentacoes[index];

    if (item.cor === "green") saldo -= item.valor;
    else saldo += item.valor;

    movimentacoes.splice(index, 1);

    salvarDados();
    atualizarTela();
}

// ================= DADOS GRAFICO
function gerarDadosGrafico() {

    const categorias = {};

    movimentacoes.forEach(item => {
        if (item.cor === "red") {
            categorias[item.categoria] =
                (categorias[item.categoria] || 0) + item.valor;
        }
    });

    return {
        labels: Object.keys(categorias),
        valores: Object.values(categorias)
    };
}

// ================= GRAFICO
function atualizarGrafico() {

    const canvas = document.getElementById("grafico");
    if (!canvas) return;

    const dados = gerarDadosGrafico();
    if (dados.labels.length === 0) return;

    const ctx = canvas.getContext("2d");

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: "pie",
        data: {
            labels: dados.labels,
            datasets: [{
                data: dados.valores
            }]
        },
        options: {
            responsive: true
        }
    });
}

// ================= INICIAR
carregarDados();