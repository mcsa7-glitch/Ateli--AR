async function carregarProdutos() {
  try {
    const resposta = await fetch("http://localhost:3000/produtos");
    const produtos = await resposta.json();

    const lista = document.getElementById("lista-produtos");

    lista.innerHTML = ""; // limpa antes

    function getImageUrl(img){
      if(!img) return "../imagens/placeholder.png";
      if(img.startsWith("/uploads") || img.startsWith("http") || img.startsWith("/")) return img;
      return `../imagens/${img}`;
    }

    produtos.forEach(produto => {
      lista.innerHTML += `
        <div class="produto">
          <img src="${getImageUrl(produto.imagem)}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p class="preco">R$ ${produto.preco}</p>
          <button>Adicionar ao carrinho</button>
        </div>
      `;
    });

  } catch (erro) {
    console.log("Erro ao carregar produtos:", erro);
  }
}

// chama a função
carregarProdutos();