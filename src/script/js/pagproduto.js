document.addEventListener("DOMContentLoaded", () => {
    fetchProduto();
});

function fetchProduto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        console.error("ID do produto não encontrado na URL.");
        return;
    }

    fetch(`http://localhost:8000/api/produtos/${id}/`)
        .then(res => res.json())
        .then(produto => renderProduto(produto))
        .catch(err => console.error("Erro ao buscar produto", err));
}

function renderProduto(produto) {

    // ===== GALERIA =====
    const mainImg = document.querySelector(".product_main_img img");
    const thumbsContainer = document.querySelector(".product_thumbs");

    const imagens = [
        produto.imagem,
        produto.imagem1,
        produto.imagem2,
        produto.imagem3
    ].filter(img => img);

    if (imagens.length > 0) {
        mainImg.src = imagens[0];
        mainImg.alt = produto.nome;
    }

    thumbsContainer.innerHTML = "";
    imagens.forEach((img, index) => {
        const btn = document.createElement("button");
        btn.className = `product_thumb ${index === 0 ? "is-active" : ""}`;
        btn.innerHTML = `<img src="${img}" alt="Foto do produto">`;

        btn.addEventListener("click", () => {
            document.querySelectorAll(".product_thumb")
                .forEach(t => t.classList.remove("is-active"));

            btn.classList.add("is-active");
            mainImg.src = img;
        });

        thumbsContainer.appendChild(btn);
    });

    // ===== TÍTULO E PREÇO =====
    document.querySelector(".product_title").textContent = produto.nome;
    document.querySelector(".badge--gold").textContent = produto.categoria?.nome || "Produto";

    document.querySelector(".product_price").textContent = `R$ ${produto.preco}`;
    document.querySelector(".product_parcel").textContent =
        `ou 6x de R$ ${(produto.preco / 6).toFixed(2)} sem juros`;

    // ===== TAMANHOS (VARIAÇÕES) =====
    const tamanhoContainer = document.querySelector(".variant_selector");

    if (!tamanhoContainer) {
        console.error("Elemento .variant_selector não existe no HTML!");
        return;
    }

    if (produto.variacoes && produto.variacoes.length > 0) {
        tamanhoContainer.innerHTML = "";

        produto.variacoes.forEach(v => {
            const chip = document.createElement("button");
            chip.className = "variant_chip";
            chip.textContent = v.tamanho;

            chip.addEventListener("click", () => {
                document.querySelectorAll(".variant_chip")
                    .forEach(c => c.classList.remove("is-selected"));

                chip.classList.add("is-selected");
            });

            tamanhoContainer.appendChild(chip);
        });

    } else {
        tamanhoContainer.innerHTML = "<p>Este produto não possui tamanhos.</p>";
    }

    // ===== DESCRIÇÃO =====
    document.querySelector(".product_description p").textContent =
        produto.descricao || "Sem descrição disponível.";
}
