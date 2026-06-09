const form =
  document.getElementById("formLogin");

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    const email =
      document.querySelector(
        'input[name="email"]'
      ).value;

    const senha =
      document.querySelector(
        'input[name="senha"]'
      ).value;

    try {

      const response =
        await fetch(
          "https://ateli-ar.onrender.com/usuarios/login",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email,
              senha
            })

          }
        );

      const usuario =
        await response.json();

      console.log(usuario);

      // verificar erro
      if (usuario.erro) {

        alert(usuario.erro);

        return;

      }

      // salvar dados
      localStorage.setItem(
        "id_usuario",
        usuario.id_usuario
      );

      localStorage.setItem(
        "id_carrinho",
        usuario.id_carrinho
      );

      localStorage.setItem(
        "nome",
        usuario.nome
      );

      alert(
        "Login feito com sucesso!"
      );
      if(usuario.especial){
        alert("Bem-vindo, usuário especial!");
        window.location.href =
        "administrador.html";
        return;
      }

      window.location.href =
        "index.html";

    } catch (erro) {

      console.log("ERRO:", erro);

      alert(
        "Erro ao conectar com o servidor"
      );

    }

  }
);

const senhaInput =
  document.getElementById("senha");

const toggle =
  document.getElementById("toggleSenha");

toggle.addEventListener(
  "click",
  () => {

    if (
      senhaInput.type === "password"
    ) {

      senhaInput.type = "text";

      toggle.classList.remove(
        "fa-eye"
      );

      toggle.classList.add(
        "fa-eye-slash"
      );

    } else {

      senhaInput.type = "password";

      toggle.classList.remove(
        "fa-eye-slash"
      );

      toggle.classList.add(
        "fa-eye"
      );

    }

  }
);