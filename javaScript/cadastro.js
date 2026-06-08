
async function cadastrar(event) {

  event.preventDefault();

  const nome =
    document.querySelector("[name='nome']").value.trim();

  const email =
    document.querySelector("[name='email']").value.trim();

  const telefone =
    document.querySelector("[name='telefone']").value.trim();

  const endereco =
    document.querySelector("[name='endereco']").value.trim();

  const senha =
    document.getElementById("senha").value;

  // validação senha
  if (senha.length < 8) {

    document.getElementById(
      "mensagem_erro"
    ).innerText =
      "A senha precisa ter pelo menos 8 caracteres.";

    return;

  }

  try {

    const res = await fetch(
      "http://localhost:3000/usuarios/cadastro",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          nome,
          email,
          telefone,
          endereco,
          senha
        })

      }
    );

    const data = await res.json();

    if (!res.ok) {

      alert(
        data.erro || "Erro no cadastro"
      );

      return;

    }

    // salvar localStorage
    localStorage.setItem(
      "id_usuario",
      data.id_usuario
    );

    localStorage.setItem(
      "id_carrinho",
      data.id_carrinho
    );

    alert(
      "Cadastro realizado com sucesso!"
    );

    window.location.href =
      "login.html";

  } catch (erro) {

    console.log(erro);

    alert(
      "Erro ao conectar com servidor"
    );

  }

}
