document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('content');

  // Garante que o container exista
  if (!container) {
    console.error("❌ Erro: elemento #content não encontrado no HTML.");
    return;
  }

  // Busca os produtos na API
  fetch('http://127.0.0.1:8000/api/produtos/')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar produtos da API.');
      return response.json();
    })
    .then(data => {
      container.innerHTML = ''; // limpa o conteúdo anterior

      // Filtra produtos da categoria "conjunto" (ou variações de capitalização)
      const conjunto = data.filter(item => 
        item.categoria && item.categoria.nome && 
        item.categoria.nome.toLowerCase().includes('conjunto')
      );

      if (conjunto.length === 0) {
        container.innerHTML = '<p>Nenhum conjunto encontrado.</p>';
        return;
      }

      // Cria cards de produtos dinamicamente
      conjunto.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" />
          <h3 class="product-name">${produto.nome}</h3>
         
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("⚠️ Erro ao carregar produtos:", error);
      container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    });
});