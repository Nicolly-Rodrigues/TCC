document.addEventListener("DOMContentLoaded", () => {
  fetchProduto();
});

function fetchProduto() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');

  if (!id) {
      console.error("ID do produto não encontrado na URL.");
      return;
  }

  fetch(`http://localhost:8000/api/produtos/${id}`)
      .then(res => res.json())
      .then(produto => renderProduto(produto))
      .catch(err => console.error("Erro ao buscar o produto", err));
}

function renderProduto(produto) {
  const container = document.getElementById("produtos-container");
  container.innerHTML = "";

  const card = document.createElement("div");
  card.className = "produto";
  card.innerHTML = `
      <div>
          <img src="${produto.imagem}" alt="${produto.nome}" />
          <img src="${produto.imagem1}" alt="${produto.nome}"/>
      </div>
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <p class="preco"> R$ ${produto.preco}</p>
      <p><strong>Categoria:</strong> ${produto.categoria?.nome || "Sem categoria"}</p>
      <button onclick="window.location.href='./carrinho.html'" class="addcarrinho">Adicionar ao carrinho</button>`;

  container.appendChild(card);
}
