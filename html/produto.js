document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);

  const categoria = params.get("categoria");

  let url =
    "https://ateli-ar.onrender.com/produtos/destaques";

  if (categoria) {

    url =
      `https://ateli-ar.onrender.com/produtos/categoria/${categoria}`;

  }

  fetch(url)

    .then(res => res.json())

    .then(produtos => {

      const lista =
        document.getElementById("lista-produtos");

      function getImageUrl(img){
        if(!img) return "../imagens/placeholder.png";
        if(img.startsWith("/uploads") || img.startsWith("http") || img.startsWith("/")) return img;
        return `../imagens/${img}`;
      }

      let html = "";

      produtos.forEach(produto => {

        html += `

        <div class="produto">

          <a
            href="produto-detalhe.html?id=${produto.id}"
            class="link-produto"
          >

            <img
              src="${getImageUrl(produto.imagem)}"
              alt="${produto.nome}"
            >

            <h3>
              ${produto.nome}
            </h3>

            <p class="preco">

              ${Number(produto.preco).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL"
                }
              )}

            </p>

          </a>

          <!-- QUANTIDADE -->

          <div class="quantidade">

            <button
              type="button"
              class="menos"
            >
              -
            </button>

            <span class="quantidade-numero">
              0
            </span>

            <button
              type="button"
              class="mais"
            >
              +
            </button>

          </div>

          <!-- BOTÃO CARRINHO -->

          <button
            type="button"
            class="btn-carrinho"
            data-id="${produto.id}"
          >
            Adicionar ao carrinho
          </button>

        </div>

        `;

      });

      lista.innerHTML = html;

    })

    .catch(erro => {

      console.log(
        "Erro:",
        erro
      );

    });

});


// =====================================
// CLIQUES DOS BOTÕES
// =====================================

document.addEventListener(

  "click",

  async function (e) {

    // ===============================
    // BOTÃO MAIS
    // ===============================

    if (e.target.classList.contains("mais")) {

      const box =
        e.target.parentElement;

      const numero =
        box.querySelector(
          ".quantidade-numero"
        );

      let quantidade =
        Number(numero.textContent);

      quantidade++;

      numero.textContent =
        quantidade;

    }


    // ===============================
    // BOTÃO MENOS
    // ===============================

    if (e.target.classList.contains("menos")) {

      const box =
        e.target.parentElement;

      const numero =
        box.querySelector(
          ".quantidade-numero"
        );

      let quantidade =
        Number(numero.textContent);

      quantidade--;

      if (quantidade < 0) {

        quantidade = 0;

      }

      numero.textContent =
        quantidade;

    }


    // ===============================
    // ADICIONAR AO CARRINHO
    // ===============================

    if (
      e.target.classList.contains(
        "btn-carrinho"
      )
    ) {

      const produto =
        e.target.closest(".produto");

      const id_produto =
        e.target.dataset.id;

      const id_usuario =
        localStorage.getItem(
          "id_usuario"
        );

      // VERIFICA LOGIN
      if (!id_usuario) {

        alert(
          "Você precisa estar logado!"
        );

        return;

      }

      // PEGA QUANTIDADE
      const quantidade = Number(

        produto
          .querySelector(
            ".quantidade-numero"
          )
          .textContent

      );

      // NÃO DEIXA ADICIONAR 0
      if (quantidade === 0) {

        alert(
          "Adicione uma quantidade antes de colocar no carrinho."
        );

        return;

      }

      try {

        const resposta = await fetch(

          "https://ateli-ar.onrender.com/carrinho/adicionar",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              id_usuario:
                id_usuario,

              id_produto:
                id_produto,

              quantidade:
                quantidade

            })

          }

        );

        const mensagem =
          await resposta.text();

        alert(mensagem);

        // ATUALIZA CONTADOR
        atualizarContadorCarrinho();

        // VOLTA PARA 0
        produto
          .querySelector(
            ".quantidade-numero"
          )
          .textContent = 0;

      } catch (erro) {

        console.log(
          "Erro ao adicionar:",
          erro
        );

      }

    }

  }

);