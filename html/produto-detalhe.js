const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("ID do produto:", id);

document.addEventListener("DOMContentLoaded", () => {

  if (!id) {

    console.log("ID não encontrado");
    return;

  }

  carregarAvaliacoes(id);

  atualizarContadorCarrinho();

  // ===============================
  // BUSCAR PRODUTO
  // ===============================

  fetch(`http://localhost:3000/produtos/${id}`)

    .then(res => res.json())

    .then(produto => {

      console.log(produto);

      function getImageUrl(img){
        if(!img) return "../imagens/placeholder.png";
        if(img.startsWith("/uploads")) return `http://localhost:3000${img}`;
        if(img.startsWith("http")) return img;
        if(img.startsWith("/")) return img;
        return `../imagens/${img}`;
      }

      document.getElementById("img-produto").src =
      getImageUrl(produto.imagem);

      document.getElementById("nome-produto").innerText =
      produto.nome;

      document.getElementById("preco-produto").innerText =

      Number(produto.preco).toLocaleString(

        "pt-BR",

        {
          style: "currency",
          currency: "BRL"
        }

      );

      const descricao =
      produto.descricao.split("\n");

      let htmlDescricao = "";

      descricao.forEach(linha => {

        htmlDescricao += `
          <p class="descricao-item">
            ${linha}
          </p>
        `;

      });

      document.getElementById(
        "descricao-produto"
      ).innerHTML = htmlDescricao;

      const miniaturas =
      document.getElementById("miniaturas");

      let imagens = [

        produto.imagem,
        produto.imagem2,
        produto.imagem3

      ];

      let htmlMini = "";

      imagens.forEach(img => {

        if(img){

          htmlMini += `

              <img
                src="${getImageUrl(img)}"
                onclick="trocarImagem('${img}', this)"
              >

            `;

        }

      });

      miniaturas.innerHTML = htmlMini;

      carregarRelacionados(
        produto.categoria
      );

    })

    .catch(erro => {

      console.log(
        "ERRO AO BUSCAR PRODUTO:",
        erro
      );

    });

});


// ===============================
// ALTERAR QUANTIDADE PRINCIPAL
// ===============================

function alterarQuantidade(valor) {

  const quantidadeElemento =

    document.getElementById(
      "quantidade-produto"
    );

  let quantidade =

    parseInt(
      quantidadeElemento.innerText
    );

  quantidade += valor;

  if (quantidade < 0) {

    quantidade = 0;

  }

  quantidadeElemento.innerText =
    quantidade;

}


// ===============================
// ALTERAR QUANTIDADE RELACIONADOS
// ===============================

function alterarQuantidadeRelacionados(
  botao,
  valor
) {

  const quantidadeElemento =

    botao.parentElement.querySelector(
      ".quantidade-numero"
    );

  let quantidade =

    parseInt(
      quantidadeElemento.innerText
    );

  quantidade += valor;

  if (quantidade < 0) {

    quantidade = 0;

  }

  quantidadeElemento.innerText =
    quantidade;

}


// ===============================
// ATUALIZAR CONTADOR
// ===============================

async function atualizarContadorCarrinho() {

  try {

    const id_usuario =
      localStorage.getItem("id_usuario");

    if (!id_usuario) return;

    const resposta = await fetch(

      `http://localhost:3000/carrinho/${id_usuario}`

    );

    const itens =
      await resposta.json();

    document.getElementById(
      "contadorCarrinho"
    ).innerText = itens.length;

  } catch (erro) {

    console.log(
      "Erro contador:",
      erro
    );

  }

}


// ===============================
// TROCAR IMAGEM
// ===============================

function trocarImagem(img, elemento) {

  document.getElementById(
    "img-produto"
  ).src = (function(i){ if(!i) return '../imagens/placeholder.png'; if(i.startsWith('/uploads') || i.startsWith('http') || i.startsWith('/')) return i; return `../imagens/${i}`; })(img);

  document
    .querySelectorAll(".miniaturas img")

    .forEach(i =>
      i.classList.remove("ativa")
    );

  elemento.classList.add("ativa");

}


// ===============================
// CARREGAR RELACIONADOS
// ===============================

function carregarRelacionados(categoria) {

  fetch(
    `http://localhost:3000/produtos/categoria/${categoria}`
  )

    .then(res => res.json())

    .then(produtos => {

      const div =
      document.getElementById("relacionados");

      let html = "";

      produtos.slice(0,4).forEach(p => {

        html += `

          <div class="produto">

            <a
              href="produto-detalhe.html?id=${p.id}"
              class="link-produto"
            >

              <img src="${(function(i){ if(!i) return '../imagens/placeholder.png'; if(i.startsWith('/uploads') || i.startsWith('http') || i.startsWith('/')) return i; return `../imagens/${i}`; })(p.imagem)}">

              <h3>${p.nome}</h3>

             

              <p class="preco">

                ${Number(p.preco).toLocaleString(

                  "pt-BR",

                  {
                    style: "currency",
                    currency: "BRL"
                  }

                )}

              </p>

            </a>

            <div class="quantidade">

              <button
                type="button"
                onclick="alterarQuantidadeRelacionados(this, -1)"
              >
                -
              </button>

              <span class="quantidade-numero">
                0
              </span>

              <button
                type="button"
                onclick="alterarQuantidadeRelacionados(this, 1)"
              >
                +
              </button>

            </div>

            <button
              type="button"
              onclick="adicionarProdutoRelacionados(this, ${p.id})"
            >

              Adicionar ao carrinho

            </button>

          </div>

        `;

      });

      div.innerHTML = html;

    });

}


// ===============================
// ADICIONAR PRODUTO PRINCIPAL
// ===============================

async function adicionarProdutoPrincipal() {

  try {

    const id_usuario =
      localStorage.getItem("id_usuario");

    if (!id_usuario) {

      alert(
        "Você precisa estar logado!"
      );

      return;

    }

    const quantidade = parseInt(

      document.getElementById(
        "quantidade-produto"
      ).innerText

    );

    if (quantidade === 0) {

      alert(
        "Adicione uma quantidade."
      );

      return;

    }

    const resposta = await fetch(

      "http://localhost:3000/carrinho/adicionar",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({

          id_usuario: id_usuario,
          id_produto: id,
          quantidade: quantidade

        })

      }

    );

    const mensagem =
    await resposta.text();

    alert(mensagem);

    atualizarContadorCarrinho();

    document.getElementById(
      "quantidade-produto"
    ).innerText = 0;

  } catch(erro){

    console.log(
      "Erro ao adicionar:",
      erro
    );

  }

}


// ===============================
// ADICIONAR RELACIONADOS
// ===============================

async function adicionarProdutoRelacionados(
  botao,
  id_produto
) {

  try {

    const id_usuario =
      localStorage.getItem("id_usuario");

    if (!id_usuario) {

      alert(
        "Você precisa estar logado!"
      );

      return;

    }

    const quantidade =

      parseInt(

        botao.parentElement
          .querySelector(
            ".quantidade-numero"
          )
          .innerText

      );

    if (quantidade === 0) {

      alert(
        "Adicione uma quantidade."
      );

      return;

    }

    const resposta = await fetch(

      "http://localhost:3000/carrinho/adicionar",

      {

        method: "POST",

        headers: {

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

          id_usuario: id_usuario,
          id_produto: id_produto,
          quantidade: quantidade

        })

      }

    );

    const mensagem =
      await resposta.text();

    alert(mensagem);

    atualizarContadorCarrinho();

    botao.parentElement
      .querySelector(
        ".quantidade-numero"
      )
      .innerText = 0;

  } catch (erro) {

    console.log(
      "Erro ao adicionar:",
      erro
    );

  }

}


// ===============================
// BOTÃO CARRINHO PRINCIPAL
// ===============================

document.getElementById("btnCarrinho")

.addEventListener("click", () => {

  adicionarProdutoPrincipal();

});


// ===============================
// CARREGAR AVALIAÇÕES
// ===============================

async function carregarAvaliacoes(id_produto){

  try {

   const id_usuario =
localStorage.getItem("id_usuario") || 0;

const resposta = await fetch(

  `http://localhost:3000/api/avaliacao/${id_produto}?id_usuario=${id_usuario}`

);

    const dados =
    await resposta.json();

    const comentarios =
    document.getElementById("comentarios");

    const estrelasTopo =
    document.getElementById("estrelas");

    const textoAvaliacao =
    document.getElementById("texto-avaliacao");

    if(
      !dados.avaliacoes ||
      dados.avaliacoes.length === 0
    ){

      comentarios.innerHTML = `

        <div class="sem-avaliacoes">

          <i class="fa-regular fa-comment"></i>

          <h3>
            Ainda não há comentários
          </h3>

          <p>
            Este produto ainda não recebeu avaliações.
          </p>

        </div>

      `;

      return;

    }

    const media =
    Number(dados.resumo.media_estrelas);

    const total =
    dados.resumo.total_avaliacoes;

    let estrelasHTML = "";

    for(let i = 1; i <= 5; i++){

      if(i <= Math.round(media)){

        estrelasHTML += `
          <i class="fa-solid fa-star"></i>
        `;

      } else {

        estrelasHTML += `
          <i class="fa-regular fa-star"></i>
        `;

      }

    }

    estrelasTopo.innerHTML =
    estrelasHTML;

    textoAvaliacao.innerText =
    `${media} ★ (${total} avaliações)`;

    let html = "";

    dados.avaliacoes.forEach(av => {

      let estrelas = "";

      for(let i = 1; i <= 5; i++){

        if(i <= av.estrelas){

          estrelas += `
            <i class="fa-solid fa-star"></i>
          `;

        } else {

          estrelas += `
            <i class="fa-regular fa-star"></i>
          `;

        }

      }

      html += `

<div class="avaliacao-card">

  <div class="avaliacao-topo">

    <strong>
      ${av.nome}
    </strong>

    <span class="data-avaliacao">
      ${av.criado_em}
    </span>

  </div>

  <div class="avaliacao-info">

    <div class="avaliacao-estrelas">

      ${estrelas}

    </div>

  </div>

  <div class="comentario-linha">

    <p class="comentario-texto">

      ${av.comentario || "Sem comentário"}

    </p>
<div class="acoes-comentario">

  <!-- POSITIVO -->
  <button

    class="${
      av.usuario_curtiu_positivo == 1
      ? 'btn-util positivo ativo'
      : 'btn-util positivo'
    }"

    onclick="curtirAvaliacao(
      ${av.id_avaliacao},
      this,
      true
    )"
  >

    <i class="${
      av.usuario_curtiu_positivo == 1
      ? 'fa-solid fa-thumbs-up'
      : 'fa-regular fa-thumbs-up'
    }"></i>

    <span class="quantidade-util">
      ${av.total_positivo || 0}
    </span>

  </button>

  <!-- NEGATIVO -->
  <button

    class="${
      av.usuario_curtiu_negativo == 1
      ? 'btn-util negativo ativo'
      : 'btn-util negativo'
    }"

    onclick="curtirAvaliacao(
      ${av.id_avaliacao},
      this,
      false
    )"
  >

    <i class="${
      av.usuario_curtiu_negativo == 1
      ? 'fa-solid fa-thumbs-down'
      : 'fa-regular fa-thumbs-down'
    }"></i>

    <span class="quantidade-util">
      ${av.total_negativo || 0}
    </span>

  </button>

</div>

  </div>

</div>

`;

    });

    comentarios.innerHTML = html;

  } catch(erro){

    console.log(
      "Erro avaliações:",
      erro
    );

  }

}


// ===============================
// FAQ
// ===============================

const perguntas =
document.querySelectorAll(".faq-pergunta");

perguntas.forEach(pergunta => {

  pergunta.addEventListener("click", () => {

    const item =
    pergunta.parentElement;

    item.classList.toggle("ativo");

  });

});


// ===============================
// CURTIR AVALIAÇÃO
// ===============================
async function curtirAvaliacao(
  id_avaliacao,
  botao,
  tipo_util
){

  try {

    const id_usuario =
    localStorage.getItem("id_usuario");

    if(!id_usuario){

      alert("Faça login");
      return;

    }

    const resposta = await fetch(

      "http://localhost:3000/api/avaliacao/util",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body: JSON.stringify({

          id_usuario,
          id_avaliacao,
          tipo_util

        })

      }

    );

    const dados =
    await resposta.json();

    // VERIFICA ERRO
    if(dados.erro){

      alert(dados.erro);
      return;

    }

    // PEGA A ÁREA DOS BOTÕES
    const container =
    botao.closest(".acoes-comentario");

    // BOTÃO POSITIVO
    const btnPositivo =
    container.querySelector(".positivo");

    // BOTÃO NEGATIVO
    const btnNegativo =
    container.querySelector(".negativo");

    // QUANTIDADES
    const qtdPositivo =
    btnPositivo.querySelector(".quantidade-util");

    const qtdNegativo =
    btnNegativo.querySelector(".quantidade-util");

    // REMOVE ESTILO DOS DOIS
    [btnPositivo, btnNegativo].forEach(btn => {

      btn.classList.remove("ativo");

      const icone =
      btn.querySelector("i");

      icone.classList.remove("fa-solid");
      icone.classList.add("fa-regular");

    });

    // SE ESTÁ ATIVO
    if(dados.ativo){

      botao.classList.add("ativo");

      const icone =
      botao.querySelector("i");

      icone.classList.remove("fa-regular");
      icone.classList.add("fa-solid");

    }

    // ATUALIZA CONTADORES
    qtdPositivo.innerText =
    dados.total_positivo;

    qtdNegativo.innerText =
    dados.total_negativo;

  } catch(erro){

    console.log(erro);

  }

}
// ===============================
// PERFIL
// ===============================

document.getElementById("btnPerfil")
.addEventListener("click", function(e){

  e.preventDefault();

  const id_usuario =
  localStorage.getItem("id_usuario");

  if(id_usuario){

    window.location.href =
    "../html/perfil.html";

  } else {

    window.location.href =
    "../html/login.html";

  }

});


// ===============================
// WINDOWS
// ===============================

window.curtirAvaliacao =
curtirAvaliacao;

window.trocarImagem =
trocarImagem;

window.alterarQuantidade =
alterarQuantidade;

window.alterarQuantidadeRelacionados =
alterarQuantidadeRelacionados;

window.adicionarProdutoRelacionados =
adicionarProdutoRelacionados;