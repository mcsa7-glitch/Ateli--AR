document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  console.log("Categoria:", categoria);

  const titulo =
    document.querySelector(".titulo-produtos");

  const nomesBonitos = {

    chaveiros: "Chaveiros",
    buque: "Buquês",
    bonecos: "Bonecos",
    animal: "Animalzinhos",
    vasos: "Vasos",
    flores: "Flores"

  };

  if (categoria) {

    const cat =
      categoria.toLowerCase().trim();

    titulo.textContent =
      nomesBonitos[cat] || cat;

  } else {

    titulo.textContent =
      "Todos os Produtos";

  }

  let url =
    "http://localhost:3000/produtos";

  if (categoria) {

    url =
      `http://localhost:3000/produtos/categoria/${categoria}`;

  }

  fetch(url)

    .then(res => res.json())

    .then(produtos => {

      const lista =
        document.getElementById("lista-produtos");

      if (!lista) {

        console.log(
          "Elemento lista-produtos não encontrado"
        );

        return;

      }

      let html = "";

      function getImageUrl(img){
        if(!img) return "../imagens/placeholder.png";
        if(img.startsWith("/uploads")) return `http://localhost:3000${img}`;
        if(img.startsWith("http")) return img;
        if(img.startsWith("/")) return img;
        return `../imagens/${img}`;
      }

      produtos.forEach(produto => {

        html += `

        <div class="produto">

          <a
            href="../html/produto-detalhe.html?id=${produto.id}"
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

  // atualiza contador
  atualizarContadorCarrinho();

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

      const id_produto =
        e.target.dataset.id;

      const id_usuario =
        localStorage.getItem(
          "id_usuario"
        );

      if (!id_usuario) {

        alert(
          "Você precisa estar logado!"
        );

        return;

      }

      const quantidade =

        Number(

          e.target.parentElement
            .querySelector(
              ".quantidade-numero"
            )
            .textContent

        );

      // impede quantidade 0
      if (quantidade === 0) {

        alert(
          "Adicione uma quantidade antes de colocar no carrinho."
        );

        return;

      }

      try {

        const resposta = await fetch(

          "http://localhost:3000/carrinho/adicionar",

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

        // atualiza contador
        atualizarContadorCarrinho();

        // volta quantidade para 0
        e.target.parentElement
          .querySelector(
            ".quantidade-numero"
          )
          .textContent = 0;

      } catch (erro) {

        console.log(
          "Erro ao adicionar produto:",
          erro
        );

      }

    }

  }

);


// ===============================
// CONTADOR REAL DO CARRINHO
// ===============================

async function atualizarContadorCarrinho() {

  try {

    const id_usuario =
      localStorage.getItem(
        "id_usuario"
      );

    if (!id_usuario) return;

    const resposta = await fetch(

      `http://localhost:3000/carrinho/${id_usuario}`

    );

    const carrinho =
      await resposta.json();

    const contador =
      document.getElementById(
        "contadorCarrinho"
      );

    if (contador) {

      contador.innerText =
        carrinho.length;

    }

  } catch (erro) {

    console.log(
      "Erro ao atualizar contador:",
      erro
    );

  }

}