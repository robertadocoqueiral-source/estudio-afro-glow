import { db } from "./firebase.js";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ========== NAVEGAÇÃO ==========
const itensMenu = document.querySelectorAll(".sidebar li");
const paginas = document.querySelectorAll(".pagina");

function mostrarPagina(idPagina) {
    paginas.forEach(p => p.classList.remove("ativa"));
    itensMenu.forEach(i => i.classList.remove("ativo"));
    document.getElementById(idPagina).classList.add("ativa");
    const liAtivo = Array.from(itensMenu).find(li => li.id.replace("menu","pagina") === idPagina);
    if (liAtivo) liAtivo.classList.add("ativo");
}

// ========== DASHBOARD ==========
document.getElementById("menuDashboard").onclick = () => { mostrarPagina("paginaDashboard"); carregarDashboard(); };

async function carregarDashboard() {
    const [ag, sv, aval] = await Promise.all([
        getDocs(collection(db, "agendamentos")),
        getDocs(collection(db, "servicos")),
        getDocs(collection(db, "avaliacoes"))
    ]);
    document.getElementById("totalAg").textContent = ag.size;
    document.getElementById("totalSv").textContent = sv.size;
    document.getElementById("totalAval").textContent = aval.size;
}

// ========== SERVIÇOS ==========
document.getElementById("menuSv").onclick = () => { mostrarPagina("paginaSv"); carregarServicos(); };
const modalSv = document.getElementById("modalSv");

document.getElementById("btnNovoServico").onclick = () => {
    document.getElementById("tituloModalSv").textContent = "Novo Serviço";
    document.getElementById("idSv").value = "";
    document.getElementById("nomeSv").value = "";
    document.getElementById("precoSv").value = "";
    modalSv.style.display = "flex";
};

document.querySelector(".modal-fechar").onclick = () => {
    modalSv.style.display = "none";
    document.getElementById("modalAval").style.display = "none";
};

document.getElementById("formSv").onsubmit = async e => {
    e.preventDefault();
    const id = document.getElementById("idSv").value;
    const dados = { nome: document.getElementById("nomeSv").value, preco: parseFloat(document.getElementById("precoSv").value) };
    if (id) {
        await updateDoc(doc(db, "servicos", id), dados);
    } else {
        await addDoc(collection(db, "servicos"), dados);
    }
    modalSv.style.display = "none";
    carregarServicos(); carregarDashboard();
};

async function carregarServicos() {
    const lista = document.getElementById("listaSv");
    lista.innerHTML = "<p>🔄 Carregando serviços...</p>";
    try {
        const snapshot = await getDocs(collection(db, "servicos"));
        lista.innerHTML = "";
        if (snapshot.empty) { lista.innerHTML = `<p>📂 Nenhum serviço cadastrado ainda.</p>`; return; }
        snapshot.forEach(doc => {
            const s = doc.data();
            const precoFormatado = s.preco ? `R$ ${parseFloat(s.preco).toFixed(2)}` : "Preço não definido";
            lista.innerHTML += `
            <div class="card">
                <h3>${s.nome || "Sem nome"}</h3>
                <p>${precoFormatado}</p>
                <div class="acoes">
                    <button class="btnEditar" data-id="${doc.id}" data-n="${s.nome || ''}" data-p="${s.preco || 0}">✏️ Editar</button>
                    <button class="btnExcluir" data-id="${doc.id}">🗑️ Excluir</button>
                </div>
            </div>`;
        });
    } catch (erro) {
        lista.innerHTML = `<p style="color:red;">❌ Erro ao carregar: ${erro.message}</p>`;
        console.error("Erro ao buscar serviços:", erro);
    }
}

document.addEventListener("click", async e => {
    if (e.target.classList.contains("btnEditar")) {
        document.getElementById("tituloModalSv").textContent = "Editar Serviço";
        document.getElementById("idSv").value = e.target.dataset.id;
        document.getElementById("nomeSv").value = e.target.dataset.n;
        document.getElementById("precoSv").value = e.target.dataset.p;
        modalSv.style.display = "flex";
    }
    if (e.target.classList.contains("btnExcluir")) {
        if (confirm("Tem certeza que deseja apagar esse serviço?")) {
            await deleteDoc(doc(db, "servicos", e.target.dataset.id));
            carregarServicos(); carregarDashboard();
        }
    }
});

// ========== AGENDAMENTOS ==========
document.getElementById("menuAg").onclick = () => { mostrarPagina("paginaAg"); carregarAgendamentos(); };

async function carregarAgendamentos() {
    const lista = document.getElementById("listaAg");
    lista.innerHTML = "<p>🔄 Carregando agendamentos...</p>";
    const dados = await getDocs(collection(db, "agendamentos"));
    lista.innerHTML = "";
    if (dados.empty) { lista.innerHTML = "<p>📂 Nenhum agendamento recebido.</p>"; return; }
    dados.forEach(doc => {
        const a = doc.data();
        lista.innerHTML += `
        <div class="card">
            <h3>${a.nome}</h3>
            <p>📱 ${a.telefone}</p>
            <p>💇 ${a.servico}</p>
            <p>📅 ${a.data} às ${a.hora}</p>
            ${a.observacao ? `<p>📝 ${a.observacao}</p>` : ""}
            <div class="acoes">
                <button class="btnConcluir" data-id="${doc.id}" data-status="${a.concluido}">
                    ${a.concluido ? "↩️ Reabrir" : "✅ Concluir"}
                </button>
                <button class="btnExcluir" data-id="${doc.id}">🗑️ Excluir</button>
            </div>
        </div>`;
    });
}

document.addEventListener("click", async e => {
    if (e.target.classList.contains("btnConcluir")) {
        await updateDoc(doc(db, "agendamentos", e.target.dataset.id), {
            concluido: e.target.dataset.status === "true" ? false : true
        });
        carregarAgendamentos();
    }
    if (e.target.classList.contains("btnExcluir")) {
        if (confirm("Apagar esse agendamento?")) {
            await deleteDoc(doc(db, "agendamentos", e.target.dataset.id));
            carregarAgendamentos(); carregarDashboard();
        }
    }
});

// ========== AVALIAÇÕES ==========
document.getElementById("menuAvaliacoes").onclick = () => { mostrarPagina("paginaAvaliacoes"); carregarAvaliacoes(); };
const modalAval = document.getElementById("modalAval");

async function carregarAvaliacoes() {
    const lista = document.getElementById("listaAval");
    lista.innerHTML = "<p>🔄 Carregando avaliações...</p>";
    const dados = await getDocs(collection(db, "avaliacoes"));
    lista.innerHTML = "";
    if (dados.empty) { lista.innerHTML = "<p>📂 Nenhuma avaliação recebida.</p>"; return; }
    dados.forEach(doc => {
        const a = doc.data();
        lista.innerHTML += `
        <div class="card">
            <h3>${a.nome} — ${"⭐".repeat(a.nota)}</h3>
            <p>${a.texto}</p>
            <div class="acoes">
                <button class="btnEditarAval" data-id="${doc.id}" data-n="${a.nome}" data-nota="${a.nota}" data-txt="${a.texto}">✏️ Editar</button>
                <button class="btnExcluir" data-id="${doc.id}">🗑️ Excluir</button>
            </div>
        </div>`;
    });
}

document.addEventListener("click", e => {
    if (e.target.classList.contains("btnEditarAval")) {
        document.getElementById("idAval").value = e.target.dataset.id;
        document.getElementById("nomeAvalEditar").value = e.target.dataset.n;
        document.getElementById("notaAvalEditar").value = e.target.dataset.nota;
        document.getElementById("textoAvalEditar").value = e.target.dataset.txt;
        modalAval.style.display = "flex";
    }
});

document.getElementById("formAval").onsubmit = async e => {
    e.preventDefault();
    await updateDoc(doc(db, "avaliacoes", document.getElementById("idAval").value), {
        nome: document.getElementById("nomeAvalEditar").value,
        nota: parseInt(document.getElementById("notaAvalEditar").value),
        texto: document.getElementById("textoAvalEditar").value
    });
    modalAval.style.display = "none";
    carregarAvaliacoes(); carregarDashboard();
};

document.addEventListener("click", async e => {
    if (e.target.classList.contains("btnExcluir")) {
        if (confirm("Apagar essa avaliação?")) {
            await deleteDoc(doc(db, "avaliacoes", e.target.dataset.id));
            carregarAvaliacoes(); carregarDashboard();
        }
    }
});

// ========== CONFIGURAÇÕES — AGORA VAI APARECER SEUS DIAS ✅ ==========
document.getElementById("menuConfig").onclick = () => {
    mostrarPagina("paginaConfig");
    carregarConfiguracoesSalvas();
};

function carregarConfiguracoesSalvas() {
    const salvas = localStorage.getItem("configAtendimento");
    if (salvas) {
        try {
            const cfg = JSON.parse(salvas);
            if (cfg.inicio) document.getElementById("horarioInicio").value = cfg.inicio;
            if (cfg.fim) document.getElementById("horarioFim").value = cfg.fim;
            if (cfg.feriados) document.getElementById("diasBloqueados").value = cfg.feriados;
        } catch (e) {
            console.log("Sem configurações anteriores");
        }
    }
}

document.getElementById("formConfig").onsubmit = e => {
    e.preventDefault();
    const cfg = {
        inicio: document.getElementById("horarioInicio").value,
        fim: document.getElementById("horarioFim").value,
        feriados: document.getElementById("diasBloqueados").value
    };
    localStorage.setItem("configAtendimento", JSON.stringify(cfg));
    alert("✅ Salvo! Seus dias bloqueados vão aparecer sempre!");
};

// ========== SAIR ==========
document.getElementById("botaoSair").onclick = () => {
    if (confirm("Deseja sair do painel?")) {
        localStorage.removeItem("logado"); // Apaga o acesso
        location.href = "login.html"; // Volta pra tela de login
    }
};

// INICIO
mostrarPagina("paginaDashboard");
carregarDashboard();