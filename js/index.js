import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

async function carregarServicosHome(){
    const lista = document.getElementById("listaServicosHome");
    lista.innerHTML = "<p>Carregando serviços...</p>";

    const dados = await getDocs(collection(db, "servicos"));
    lista.innerHTML = "";

    if(dados.empty){
        lista.innerHTML = "<p>Nenhum serviço cadastrado ainda.</p>";
        return;
    }

    dados.forEach(doc => {
        const s = doc.data();

        let foto = "imagens/servico-padrao.jpg";
        if(s.nome.includes("Box")) foto = "imagens/box-braids.jpg";
        if(s.nome.includes("French")) foto = "imagens/french-curl.jpg";
        if(s.nome.includes("Boho")) foto = "imagens/boho-braids.jpg";

        lista.innerHTML += `
        <div class="card">
            <img src="${foto}" alt="${s.nome}">
            <div class="conteudo-card">
                <h3>${s.nome}</h3>
                <p class="preco-servico">💰 R$ ${s.preco}</p>
                <a href="agendamento.html" class="botao-card">Agendar</a>
            </div>
        </div>`;
    });
}

carregarServicosHome();