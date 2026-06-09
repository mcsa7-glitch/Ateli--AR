async function carregarCarrinho() {

  const idUsuario =
    localStorage.getItem("id_usuario");
  const idCarrinho =
    localStorage.getItem("id_carrinho");

  // se não estiver logado ou não tiver carrinho
  if (!idUsuario || !idCarrinho) {

    const carrinho =
      document.getElementById("carrinho");

    carrinho.innerHTML = `
      <div class="carrinho-vazio">
        <i class="fa-solid fa-cart-shopping"></i>
        <h2>Seu carrinho está vazio</h2>
        <p>Faça login para adicionar produtos</p>
      </div>
    `;

    const resumo = document.querySelector(".resumo");
    if (resumo) resumo.style.display = "none";

    const contador = document.getElementById("contadorCarrinho");
    if (contador) contador.innerText = "0";

    const subtotal = document.getElementById("subtotal");
    const frete = document.getElementById("frete");
    const total = document.getElementById("total");

    if (subtotal) subtotal.innerText = "R$ 0.00";
    if (frete) frete.innerText = "R$ 0.00";
    if (total) total.innerText = "R$ 0.00";

    return;
  }

  try {

    const resposta = await fetch(
      `https://ateli-ar.onrender.com/carrinho/${localStorage.getItem("id_usuario")}`
    );

    const itens = await resposta.json();

    const carrinho =
      document.getElementById("carrinho");

    carrinho.innerHTML = "";

    let total = 0;

    if (itens.length === 0) {

      carrinho.innerHTML = `
        <div class="carrinho-vazio">
          <i class="fa-solid fa-cart-shopping"></i>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos ao carrinho</p>
        </div>
      `;

      document.querySelector(".resumo").style.display = "none";

      document.getElementById("subtotal").innerText = "R$ 0.00";
      document.getElementById("frete").innerText = "R$ 0.00";
      document.getElementById("total").innerText = "R$ 0.00";

      atualizarContadorCarrinho();

      return;
    }

    document.querySelector(".resumo").style.display = "block";

    let desmarcados =
      JSON.parse(localStorage.getItem("desmarcados"));

    const selecionados =
      JSON.parse(localStorage.getItem("selecionados"));

    if (!Array.isArray(desmarcados)) {
      if (Array.isArray(selecionados)) {
        desmarcados = itens
          .filter(item => !selecionados.includes(item.id_item))
          .map(item => item.id_item);
        localStorage.setItem(
          "desmarcados",
          JSON.stringify(desmarcados)
        );
      } else {
        desmarcados = [];
      }
      localStorage.removeItem("selecionados");
    }

    itens.forEach(item => {

      total += Number(
        String(item.subtotal)
          .replace("R$", "")
          .replace(",", ".")
          .trim()
      );

      const marcado = !desmarcados.includes(item.id_item);

      carrinho.innerHTML += `

        <div class="item">
          
          <input
            type="checkbox"
            class="selecionar-item"
            data-id="${item.id_item}"
            onchange="toggleItem(${item.id_item}, this)"
            ${marcado ? "checked" : ""}
          >
          <div class="b">
          <img src="${(function(img){ if(!img) return '../imagens/placeholder.png'; if(img.startsWith('/uploads') || img.startsWith('http') || img.startsWith('/')) return img; return `../imagens/${img}`; })(item.imagem)}">
          <div class="info-produto">
            <h3>${item.nome}</h3>
            <p>Produto artesanal</p>
          </div>
          </div>
          <div class="preco">
            R$ ${item.preco}
          </div>

          <div class="quantidade">

            <button onclick="alterarQuantidade(${item.id_item}, ${item.quantidade - 1})">
              -
            </button>

            <span>${item.quantidade}</span>

            <button onclick="alterarQuantidade(${item.id_item}, ${item.quantidade + 1})">
              +
            </button>

          </div>

          <div class="subtotal">
            R$ ${item.subtotal}
          </div>

          <button class="remover" onclick="removerItem(${item.id_item})">
            ×
          </button>

        </div>

      `;

    });

    document.getElementById("subtotal").innerText =
      `R$ ${total.toFixed(2)}`;

    document.getElementById("total").innerText =
      `R$ ${total.toFixed(2)}`;

    atualizarTotalSelecionados();
    atualizarContadorCarrinho();

  } catch (erro) {
    console.log(erro);
  }
}

// =========================

function toggleItem(id, checkbox) {

  let desmarcados =
    JSON.parse(localStorage.getItem("desmarcados")) || [];

  if (checkbox.checked) {
    desmarcados = desmarcados.filter(i => i !== id);
  } else {
    if (!desmarcados.includes(id)) {
      desmarcados.push(id);
    }
  }

  localStorage.setItem(
    "desmarcados",
    JSON.stringify(desmarcados)
  );

  atualizarTotalSelecionados();
}

// =========================

async function removerItem(id_item) {

  await fetch(
    `https://ateli-ar.onrender.com/carrinho/item/${id_item}`,
    { method: "DELETE" }
  );

  carregarCarrinho();
}

// =========================

async function alterarQuantidade(id_item, novaQuantidade) {

  if (novaQuantidade <= 0) {
    await removerItem(id_item);
    return;
  }

  await fetch(
    `https://ateli-ar.onrender.com/carrinho/item/${id_item}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantidade: novaQuantidade
      })
    }
  );

  carregarCarrinho();
}



// =========================

async function atualizarContadorCarrinho() {

  const idUsuario = localStorage.getItem("id_usuario");

  if (!idUsuario) {
    const contador = document.getElementById("contadorCarrinho");
    if (contador) contador.innerText = "0";
    return;
  }

  const resposta = await fetch(
    `https://ateli-ar.onrender.com/carrinho/${idUsuario}`
  );

  const itens = await resposta.json();

  const contador = document.getElementById("contadorCarrinho");
  if (contador) contador.innerText = itens.length;
}

// =========================

function atualizarTotalSelecionados() {

  const itens =
    document.querySelectorAll(".item");

  let total = 0;

  itens.forEach(item => {

    const checkbox =
      item.querySelector(".selecionar-item");

    if (checkbox.checked) {

      const valor =
        String(item.querySelector(".subtotal").innerText)
          .replace("R$", "")
          .replace(",", ".")
          .trim();

      total += Number(valor);
    }

  });

  document.getElementById("subtotal")
    .innerText = `R$ ${total.toFixed(2)}`;

  document.getElementById("total")
    .innerText = `R$ ${total.toFixed(2)}`;
}

// =========================

carregarCarrinho();
atualizarContadorCarrinho();