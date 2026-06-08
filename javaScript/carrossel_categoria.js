const carousel = document.getElementById("carousel");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// ===============================
// MOVER CARROSSEL
// ===============================

rightBtn.onclick = () => {

    carousel.scrollBy({
        left: 300,
        behavior: "smooth"
    });

};

leftBtn.onclick = () => {

    carousel.scrollBy({
        left: -300,
        behavior: "smooth"
    });

};

// ===============================
// MOSTRAR / ESCONDER SETAS
// ===============================

function checkArrows() {

    const scrollLeft =
    carousel.scrollLeft;

    const maxScroll =
    carousel.scrollWidth -
    carousel.clientWidth;

    // seta esquerda
    if (scrollLeft <= 0) {

        leftBtn.style.display = "none";

    } else {

        leftBtn.style.display = "flex";

    }

    // seta direita
    if (scrollLeft >= maxScroll - 1) {

        rightBtn.style.display = "none";

    } else {

        rightBtn.style.display = "flex";

    }

}

// ===============================
// EVENTOS
// ===============================

carousel.addEventListener(
    "scroll",
    checkArrows
);

window.addEventListener(
    "load",
    checkArrows
);

window.addEventListener(
    "resize",
    checkArrows
);

// ===============================
// DESTAQUE DA CATEGORIA ATUAL
// ===============================

const itens =
document.querySelectorAll(".item");

// pega categoria da URL
const params =
new URLSearchParams(
    window.location.search
);

const categoriaAtual =
params.get("categoria");

// remove destaque
itens.forEach(item => {

    item.classList.remove(
        "ativo"
    );

});

// adiciona destaque
// apenas na categoria atual
itens.forEach(item => {

    const link =
    item.querySelector("a");

    if (!link) return;

    const url =
    new URL(link.href);

    const categoriaLink =
    url.searchParams.get(
        "categoria"
    );

    if (
        categoriaLink ===
        categoriaAtual
    ) {

        item.classList.add(
            "ativo"
        );

    }

});