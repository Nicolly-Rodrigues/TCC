// pagproduto.js - versão robusta
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  ativarQuantidade(); // prepara os botões + e - mesmo antes de renderizar (se existirem)
  fetchProduto();
}

/* ====== FETCH DO PRODUTO ====== */
function fetchProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    console.error("ID do produto não encontrado na URL.");
    return;
  }

  console.log("Buscando produto id=", id);
  fetch(`http://localhost:8000/api/produtos/${id}/`)
    .then(res => {
      if (!res.ok) throw new Error("Resposta da API não OK: " + res.status);
      return res.json();
    })
    .then(produto => {
      console.log("Produto recebido:", produto);
      renderProduto(produto);
    })
    .catch(err => console.error("Erro ao buscar produto", err));
}

/* ====== RENDERIZA A PÁGINA COM O PRODUTO ====== */
function renderProduto(produto) {

  // --- GALERIA ---
  const mainImg = document.querySelector(".product_main_img img");
  const thumbsContainer = document.querySelector(".product_thumbs");

  if (!mainImg || !thumbsContainer) {
    console.warn("Galeria: seletores .product_main_img ou .product_thumbs não encontrados.");
  }

  const imagens = [produto.imagem, produto.imagem1, produto.imagem2, produto.imagem3].filter(Boolean);

  if (imagens.length > 0 && mainImg) {
    mainImg.src = imagens[0];
    mainImg.alt = produto.nome;
  }

  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    imagens.forEach((img, index) => {
      const btn = document.createElement("button");
      btn.className = `product_thumb ${index === 0 ? "is-active" : ""}`;
      btn.innerHTML = `<img src="${img}" alt="Foto do produto">`;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".product_thumb").forEach(t => t.classList.remove("is-active"));
        btn.classList.add("is-active");
        if (mainImg) mainImg.src = img;
      });

      thumbsContainer.appendChild(btn);
    });
  }

  // --- TITULO / PREÇO ---
  const titleEl = document.querySelector(".product_title");
  const badgeEl = document.querySelector(".badge--gold");
  const priceEl = document.querySelector(".product_price");
  const parcelEl = document.querySelector(".product_parcel");
  const descEl = document.querySelector(".product_description p");

  if (titleEl) titleEl.textContent = produto.nome || "";
  if (badgeEl) badgeEl.textContent = produto.categoria?.nome || "Produto";
  if (priceEl) priceEl.textContent = produto.preco ? `R$ ${produto.preco}` : "";
  if (parcelEl && produto.preco) parcelEl.textContent = `ou 6x de R$ ${(Number(produto.preco) / 6).toFixed(2)} sem juros`;
  if (descEl) descEl.textContent = produto.descricao || "Sem descrição disponível.";

  // --- TAMANHOS (VARIAÇÕES) ---
  // aceita .variant_selector (seu CSS) ou .product_sizes (fallback)
  const tamanhoContainer = document.querySelector(".variant_selector") || document.querySelector(".product_sizes");
  if (!tamanhoContainer) {
    console.warn("Container de tamanhos não encontrado. Adicione .variant_selector no HTML.");
  } else {
    tamanhoContainer.innerHTML = "";

    if (produto.variacoes && produto.variacoes.length > 0) {
      produto.variacoes.forEach((v, idx) => {
        const chip = document.createElement("button");
        chip.className = "variant_chip";
        chip.type = "button";
        chip.textContent = v.tamanho;
        // guarda dados úteis
        chip.dataset.variacaoId = v.id;
        chip.dataset.tamanho = v.tamanho;
        chip.dataset.estoque = v.estoque ?? 0;

        // desabilita se estoque 0
        if (Number(chip.dataset.estoque) <= 0) {
          chip.disabled = true;
          chip.style.opacity = "0.5";
        }

        chip.addEventListener("click", () => {
          document.querySelectorAll(".variant_chip").forEach(c => c.classList.remove("is-selected"));
          chip.classList.add("is-selected");
        });

        tamanhoContainer.appendChild(chip);
      });

      // opcional: selecionar o primeiro automaticamente
      const firstChip = tamanhoContainer.querySelector(".variant_chip:not([disabled])");
      if (firstChip) firstChip.classList.add("is-selected");
    } else {
      tamanhoContainer.innerHTML = "<p>Este produto não possui tamanhos.</p>";
    }
  }

  // --- GARANTIR que os controles de quantidade estão funcionando ---
  ativarQuantidade(); // reativa caso elementos tenham sido (re)inseridos

  // --- CONFIGURAR BOTÃO ADICIONAR AO CARRINHO ---
  configurarAdicionarCarrinho(produto);
}

/* ====== QUANTIDADE (+ / -) ====== */
function ativarQuantidade() {
  const btnMais = document.getElementById("qty_plus");
  const btnMenos = document.getElementById("qty_minus");
  const input = document.getElementById("qty_value");

  if (!btnMais || !btnMenos || !input) {
    //console.log("Controles de quantidade não encontrados ainda.");
    return;
  }

  // Remove listeners antigos (proteção contra múltiplas chamadas)
  btnMais.replaceWith(btnMais.cloneNode(true));
  btnMenos.replaceWith(btnMenos.cloneNode(true));
  const newMais = document.getElementById("qty_plus");
  const newMenos = document.getElementById("qty_minus");

  newMais.addEventListener("click", () => {
    input.value = Number(input.value || 1) + 1;
  });

  newMenos.addEventListener("click", () => {
    const valorAtual = Number(input.value || 1);
    if (valorAtual > 1) input.value = valorAtual - 1;
  });
}

/* ====== ADICIONAR AO CARRINHO ====== */
function configurarAdicionarCarrinho(produto) {
  // procura botão pelo id ou pelos estilos padrão
  let addBtn = document.getElementById("add_to_cart_btn");
  if (!addBtn) {
    addBtn = document.querySelector(".btn_primary.btn_full, .btn_primary, .btn_full, button.buy_button, button.btn");
  }
  if (!addBtn) {
    console.error("Botão de adicionar ao carrinho não encontrado. Adicione id='add_to_cart_btn' no botão.");
    return;
  }

  // remove listeners antigos (proteção contra múltiplos cliques/handlers)
  const addBtnClone = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(addBtnClone, addBtn);
  addBtn = addBtnClone;

  addBtn.addEventListener("click", () => {

    // quantidade
    const qtyInput = document.getElementById("qty_value");
    const quantidade = qtyInput ? Math.max(1, Number(qtyInput.value || 1)) : 1;

    // tamanho selecionado (se existir)
    const selectedSizeEl = document.querySelector(".variant_chip.is-selected");
    const tamanho = selectedSizeEl ? selectedSizeEl.dataset.tamanho || selectedSizeEl.textContent : null;

    if (!tamanho && document.querySelector(".variant_chip")) {
      // existe seletor de tamanho mas nada selecionado
      alert("Por favor selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    const itemCarrinho = {
      produto_id: produto.id,
      nome: produto.nome,
      preco: Number(produto.preco) || 0,
      imagem: produto.imagem,
      tamanho: tamanho, // null se produto sem variações
      quantidade: quantidade,
      variacao_id: selectedSizeEl ? selectedSizeEl.dataset.variacaoId : null
    };

    // recuperar carrinho local
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // procurar item igual (mesmo produto + mesma variação/tamanho)
    const existeIdx = carrinho.findIndex(it =>
      it.produto_id === itemCarrinho.produto_id &&
      (it.variacao_id || it.tamanho || "") === (itemCarrinho.variacao_id || itemCarrinho.tamanho || "")
    );

    if (existeIdx > -1) {
      carrinho[existeIdx].quantidade = (Number(carrinho[existeIdx].quantidade) || 0) + itemCarrinho.quantidade;
    } else {
      carrinho.push(itemCarrinho);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    console.log("Carrinho atualizado:", carrinho);

    // feedback visual
    const originalText = addBtn.textContent;
    addBtn.textContent = "Adicionado!";
    addBtn.style.opacity = "0.9";
    setTimeout(() => {
      addBtn.textContent = originalText;
      addBtn.style.opacity = "";
    }, 1200);
  });
}
