document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.products'); // pega o grid correto

  if (!container) {
    console.error("❌ Erro: elemento .products não encontrado no HTML.");
    return;
  }

  fetch('http://127.0.0.1:8000/api/produtos/')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar produtos da API.');
      return response.json();
    })
    .then(data => {
      container.innerHTML = '';

      const tenis = data.filter(item =>
        item.categoria &&
        item.categoria.nome &&
        item.categoria.nome.toLowerCase().includes('tênis')
      );

      if (tenis.length === 0) {
        container.innerHTML = '<p>Nenhum Tênis encontrado.</p>';
        return;
      }

      tenis.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product_card';

        card.innerHTML = `
         <div class="product_img_box">
      <img src="${produto.imagem}" alt="${produto.nome}">
    </div>

    <div class="product_info">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao || "Descrição breve do produto."}</p>

      <a href="../pages/pagproduto.html?id=${produto.id}" class="product_link">
        VER ${produto.nome.toUpperCase()}
      </a>
    </div>
  `;
        

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("⚠️ Erro ao carregar produtos:", error);
      container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    });
});
