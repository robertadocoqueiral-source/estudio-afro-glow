// ===== AQUI VOCÊ ALTERA SEU E-MAIL E SENHA =====
const EMAIL_CERTO = "robertadocoqueiral@gmail.com";  // ← coloque seu e-mail
const SENHA_CERTA = "4002";                 // ← coloque sua senha
// ===============================================

// Se já estiver logado, vai direto pro painel
if (localStorage.getItem("logado") === "sim") {
    location.href = "painel.html";
}

const btnEntrar = document.getElementById("btnEntrar");
const btnVoltar = document.getElementById("btnVoltar");
const erro = document.getElementById("erro");

btnEntrar.onclick = () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email === EMAIL_CERTO && senha === SENHA_CERTA) {
        localStorage.setItem("logado", "sim");
        location.href = "painel.html";
    } else {
        erro.style.display = "block";
        document.getElementById("senha").value = "";
    }
};

// Botão Voltar → vai pra página inicial
btnVoltar.onclick = () => {
    location.href = "index.html";
};