const id = localStorage.getItem("id_usuario");

// 🔒 proteção login
if (!id) {
    alert("Você precisa estar logado!");
    window.location.href = "../html/login.html";
}

// inputs
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");
const enderecoInput = document.getElementById("endereco");

const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");


// ===============================
// 📥 CARREGAR DADOS
// ===============================
async function carregarDados() {
    try {
        const res = await fetch(`http://localhost:3000/usuarios/usuario/${id}`);

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const user = await res.json();

        nomeInput.value = user.nome || "";
        emailInput.value = user.email || "";
        telefoneInput.value = user.telefone || "";
        enderecoInput.value = user.endereco || "";

    } catch (erro) {
        alert("Erro ao carregar dados do usuário");
        console.log(erro);
    }
}

carregarDados();


// ===============================
// ✏️ EDITAR PERFIL
// ===============================
const editBtn = document.getElementById("editBtn");

editBtn.addEventListener("click", () => {

    const inputs = [nomeInput, telefoneInput, enderecoInput, emailInput];

    // verifica se está editando
    const editando = editBtn.classList.contains("editing");

    if (!editando) {

        // ABRIR edição
        inputs.forEach(input => input.readOnly = false);

        senhaInput.style.display = "block";
        confirmarSenhaInput.style.display = "block";

        document.getElementById("labelSenha").style.display = "block";
        document.getElementById("labelConfirmarSenha").style.display = "block";

        document.querySelectorAll(".senha-container").forEach(div => {
            div.style.display = "flex";
        });

        document.getElementById("salvar").style.display = "block";

        editBtn.classList.add("editing");

    } else {

        // FECHAR edição
        inputs.forEach(input => input.readOnly = true);

        senhaInput.style.display = "none";
        confirmarSenhaInput.style.display = "none";

        document.getElementById("labelSenha").style.display = "none";
        document.getElementById("labelConfirmarSenha").style.display = "none";

        document.querySelectorAll(".senha-container").forEach(div => {
            div.style.display = "none";
        });

        document.getElementById("salvar").style.display = "none";

        editBtn.classList.remove("editing");
    }

});


// ===============================
// 💾 SALVAR ALTERAÇÕES
// ===============================
document.getElementById("salvar").addEventListener("click", async () => {

    const senha = senhaInput.value;
    const confirmar = confirmarSenhaInput.value;

    // validação senha
    if (senha || confirmar) {
        if (senha !== confirmar) {
            alert("As senhas não coincidem!");
            return;
        }

        if (senha.length < 8) {
            alert("A senha deve ter pelo menos 8 caracteres!");
            return;
        }
    }

    try {
        const res = await fetch(`http://localhost:3000/usuarios/usuario/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nomeInput.value,
                telefone: telefoneInput.value,
                endereco: enderecoInput.value,
                email: emailInput.value,
                senha: senha || null
            })
        });

        if (res.ok) {

            alert("Dados atualizados com sucesso!");

            // 🔄 volta ao modo normal
            document.getElementById("salvar").style.display = "none";

            [nomeInput, telefoneInput, enderecoInput, emailInput].forEach(input => {
                input.readOnly = true;
            });

            senhaInput.value = "";
            confirmarSenhaInput.value = "";

            senhaInput.style.display = "none";
            confirmarSenhaInput.style.display = "none";

            document.getElementById("labelSenha").style.display = "none";
            document.getElementById("labelConfirmarSenha").style.display = "none";

            document.querySelectorAll(".senha-container").forEach(div => {
                div.style.display = "none";
            });

            document.getElementById("editBtn").classList.remove("editing");

        } else {
            const erroMsg = await res.text();
            console.log(erroMsg);
            alert("Erro ao atualizar dados");
        }

    } catch (erro) {
        alert("Erro ao salvar alterações");
        console.log(erro);
    }
});


// ===============================
// 🗑️ EXCLUIR CONTA
// ===============================
document.getElementById("excluir").addEventListener("click", async () => {

    if (confirm("Tem certeza que deseja excluir sua conta?")) {

        try {
            const res = await fetch(`http://localhost:3000/usuarios/usuario/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                localStorage.removeItem("id_usuario");
                alert("Conta excluída com sucesso!");
                window.location.href = "../html/login.html";
            } else {
                alert("Erro ao excluir conta");
            }

        } catch (erro) {
            alert("Erro ao excluir conta");
        }
    }
});


// ===============================
// 🚪 SAIR
// ===============================
document.getElementById("sair").addEventListener("click", () => {
    localStorage.removeItem("id_usuario");
    window.location.href = "../html/login.html";
});


// ===============================
// 👁️ OLHINHO SENHA
// ===============================
document.getElementById("olhoSenha").addEventListener("click", function () {

    const input = senhaInput;

    if (input.type === "password") {
        input.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
    }
});

document.getElementById("olhoConfirmarSenha").addEventListener("click", function () {

    const input = confirmarSenhaInput;

    if (input.type === "password") {
        input.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
    }
});