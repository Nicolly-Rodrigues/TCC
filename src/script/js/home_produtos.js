const produtosHome = [3, 14, 19, 12]; // IDs dos produtos da home

fetch("data/produtos.json")
  .then(r => r.json())
  .then(produtos => {
    const container = document.querySelector(".products");

    const selecionados = produtos.filter(p => produtosHome.includes(p.id));

    selecionados.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product_card");

      card.innerHTML = `
        <a href="src/pages/pagproduto.html?id=${p.id}">
          <img src="${p.img}" alt="${p.nome}">
        </a>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.log("Erro ao carregar produtos:", err));
