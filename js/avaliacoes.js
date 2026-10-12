import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =========================
// CARREGAR AVALIAÇÕES
// =========================
async function carregarAvaliacoes(){
    const lista = document.getElementById("listaAvaliacoes");
    lista.innerHTML = "<p>Carregando...</p>";

    const dados = await getDocs(collection(db, "avaliacoes"));
    lista.innerHTML = "";

    if(dados.empty){
        lista.innerHTML = "<p>Nenhuma avaliação ainda. Seja a primeira!</p>";
        return;
    }

    dados.forEach(doc => {
        const a = doc.data();
        const estrelas = "⭐".repeat(a.nota);

        lista.innerHTML += `
        <div class="card-avaliacao">
            <div class="cabecalho-avaliacao">
                <strong>${a.nome}</strong>
                <span>${estrelas}</span>
            </div>
            <p>${a.texto}</p>
        </div>`;
    });
}

// =========================
// SELECIONAR ESTRELAS
// =========================
document.addEventListener("click", e => {
    if(e.target.classList.contains("estrela")){
        const nota = parseInt(e.target.dataset.nota);
        document.getElementById("notaAvalia").value = nota;
        
        document.querySelectorAll(".estrela").forEach((estrela, indice) => {
            estrela.style.opacity = (4 - indice < nota) ? "1" : "0.3";
        });
    }
});

// =========================
// CONTADOR DE CARACTERES
// =========================
document.getElementById("textoAvalia").addEventListener("input", e => {
    const total = e.target.value.length;
    document.querySelector(".contador").textContent = `${total} / 500`;
});

// =========================
// ENVIAR AVALIAÇÃO
// =========================
document.getElementById("formAvaliacao").addEventListener("submit", async e => {
    e.preventDefault();

    const nome = document.getElementById("nomeAvalia").value.trim();
    const nota = parseInt(document.getElementById("notaAvalia").value);
    const texto = document.getElementById("textoAvalia").value.trim();

    if(!nome || !texto) return alert("Preencha seu nome e seu depoimento!");

    await addDoc(collection(db, "avaliacoes"), {
        nome, nota, texto
    });

    alert("Obrigada pela sua avaliação! 🤍");
    document.getElementById("formAvaliacao").reset();
    document.querySelector(".contador").textContent = "0 / 500";
    carregarAvaliacoes();
});

// INICIAR
carregarAvaliacoes();