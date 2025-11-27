document.addEventListener("DOMContentLoaded", () => {
renderCarrinho();


// Conecta o botao do HTML a funcao de finalizar pedido
const botaoFinalizar = document.getElementById("btnFinalizarPedido");
if (botaoFinalizar) {
    botaoFinalizar.addEventListener("click", finalizarPedido);
}


});

function getCarrinho() {
return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(lista) {
localStorage.setItem("carrinho", JSON.stringify(lista));
}

function renderCarrinho() {
const carrinho = getCarrinho();
const container = document.querySelector(".cart_list");


// Remove apenas os artigos do carrinho existentes
container.querySelectorAll(".cart_item").forEach(item => item.remove());

if (carrinho.length === 0) {
    if (!container.querySelector(".cart_empty")) {
        const emptyMsg = document.createElement("p");
        emptyMsg.classList.add("cart_empty");
        emptyMsg.textContent = "Seu carrinho esta vazio.";
        container.appendChild(emptyMsg);
    }
    atualizarResumo();
    return;
}

const emptyMsg = container.querySelector(".cart_empty");
if (emptyMsg) emptyMsg.remove();

carrinho.forEach((item, index) => {
    const article = document.createElement("article");
    article.classList.add("cart_item");

    article.innerHTML = `
        <div class="cart_item_media">
            <div class="cart_item_image">
                <img src="${item.imagem}" alt="${item.nome}">
            </div>
        </div>

        <div class="cart_item_info">
            <h2>${item.nome}</h2>
            <p class="cart_item_meta">Tamanho: ${item.tamanho}</p>
            <button class="cart_item_remove" data-index="${index}">Remover</button>
        </div>

        <div class="cart_item_actions">
            <span class="cart_item_price">R$ ${item.preco.toFixed(2)}</span>

            <div class="qty">
                <button class="btn btn_outline qty_minus" data-index="${index}">-</button>
                <input type="text" value="${item.quantidade}" readonly>
                <button class="btn btn_outline qty_plus" data-index="${index}">+</button>
            </div>

            <span class="cart_item_subtotal">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        </div>
    `;

    container.appendChild(article);
});

ativarAcoes();
atualizarResumo();


}

function ativarAcoes() {
const carrinho = getCarrinho();


document.querySelectorAll(".cart_item_remove").forEach(btn => {
    btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        carrinho.splice(index, 1);
        salvarCarrinho(carrinho);
        renderCarrinho();
    });
});

document.querySelectorAll(".qty_plus").forEach(btn => {
    btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        carrinho[index].quantidade++;
        salvarCarrinho(carrinho);
        renderCarrinho();
    });
});

document.querySelectorAll(".qty_minus").forEach(btn => {
    btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
            salvarCarrinho(carrinho);
            renderCarrinho();
        }
    });
});


}

function atualizarResumo() {
const carrinho = getCarrinho();
const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);


const rows = document.querySelectorAll(".cart_summary_row span:last-child");
if (rows.length >= 3) {
    rows[0].textContent = `R$ ${subtotal.toFixed(2)}`;
    rows[2].textContent = `R$ ${subtotal.toFixed(2)}`;
}


}

// FINALIZAR PEDIDO
async function finalizarPedido() {
const carrinho = getCarrinho();

if (carrinho.length === 0) {
    alert("Seu carrinho esta vazio.");
    return;
}

const token = localStorage.getItem("token");
if (!token) {
    alert("Voce precisa estar logado para finalizar o pedido.");
    return;
}

const itens = carrinho.map(item => ({
    variacao_id: item.variacao_id,
    quantidade: item.quantidade
}));

try {
    const resposta = await fetch("http://127.0.0.1:8000/api/finalizar-pedido/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ itens })
    });

    const text = await resposta.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!resposta.ok) {
        console.error("Resposta do servidor:", data);
        alert("Erro ao finalizar: " + JSON.stringify(data));
        return;
    }

    alert("Pedido feito com sucesso! Finalize seu pagamento via WhatsApp para confirmar seu pedido");
    localStorage.removeItem("carrinho");
    renderCarrinho();

} catch (error) {
    console.error("Erro ao finalizar:", error);
    alert("Erro inesperado ao finalizar pedido.");
}


}
