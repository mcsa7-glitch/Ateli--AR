document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  fetch(`http://localhost:3000/produtos/categoria/${categoria}`)
    .then(res => res.json())
    .then(produtos => {

      const lista = document.getElementById("lista-produtos");
      function getImageUrl(img){
        if(!img) return "../imagens/placeholder.png";
        if(img.startsWith("/uploads") || img.startsWith("http") || img.startsWith("/")) return img;
        return `../imagens/${img}`;
      }

      let html = "";

      produtos.forEach(produto => {

        html += `
          <div class="produto">

            <a href="produto-detalhe.html?id=${produto.id}"
               class="link-produto">

              <img src="${getImageUrl(produto.imagem)}">

              <h3>${produto.nome}</h3>

              <p class="preco">
                ${Number(produto.preco).toLocaleString(
                  "pt-BR",
                  {
                    style:"currency",
                    currency:"BRL"
                  }
                )}
              </p>

            </a>

          </div>
        `;
      });

      lista.innerHTML = html;
    })
    .catch(erro => {
      console.log("Erro ao carregar produtos:", erro);
    });

});