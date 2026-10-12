import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// =========================
// CARREGAR SERVIÇOS DO PAINEL
// =========================
async function carregarServicosNoAgendamento(){
    const select = document.getElementById("servico");
    const dados = await getDocs(collection(db, "servicos"));
    
    select.innerHTML = `<option value="">Escolha o serviço</option>`;
    dados.forEach(doc => {
        const s = doc.data();
        select.innerHTML += `<option value="${s.nome}">${s.nome} — R$ ${s.preco}</option>`;
    });
}

// =========================
// BLOQUEAR FIM DE SEMANA E HORÁRIOS OCUPADOS
// =========================
async function carregarHorariosDisponiveis(){
    const dataEscolhida = document.getElementById("data").value;
    const botoesHorario = document.querySelectorAll(".hora");

    if(!dataEscolhida) return;

    // Verifica dia da semana: 0 = Domingo, 6 = Sábado
    const dataObj = new Date(dataEscolhida + "T00:00:00");
    const diaSemana = dataObj.getDay();

    // Bloqueia automaticamente Sábado e Domingo
    if(diaSemana === 0 || diaSemana === 6){
        botoesHorario.forEach(btn => {
            btn.disabled = true;
            btn.classList.add("indisponivel");
            btn.classList.remove("selecionado");
        });
        document.getElementById("hora").value = "";
        return;
    }

    // Libera todos os horários primeiro para dias úteis
    botoesHorario.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("indisponivel");
    });

    // Busca agendamentos ativos dessa data
    const agendamentosQuery = query(
        collection(db, "agendamentos"),
        where("data", "==", dataEscolhida),
        where("concluido", "!=", true)
    );

    const dados = await getDocs(agendamentosQuery);
    const horariosOcupados = [];
    dados.forEach(doc => {
        horariosOcupados.push(doc.data().hora);
    });

    // Bloqueia os horários já marcados
    botoesHorario.forEach(btn => {
        const horaBotao = btn.dataset.hora;
        if(horariosOcupados.includes(horaBotao)){
            btn.disabled = true;
            btn.classList.add("indisponivel");
        }
    });
}

// =========================
// SELECIONAR HORÁRIO
// =========================
document.addEventListener("click", e => {
    if(e.target.classList.contains("hora") && !e.target.disabled){
        document.querySelectorAll(".hora").forEach(b => b.classList.remove("selecionado"));
        e.target.classList.add("selecionado");
        document.getElementById("hora").value = e.target.dataset.hora;
        atualizarResumo();
    }
});

// =========================
// ATUALIZAR RESUMO AUTOMÁTICO
// =========================
function atualizarResumo(){
    document.getElementById("resNome").textContent = document.getElementById("nome").value || "-";
    document.getElementById("resTelefone").textContent = document.getElementById("telefone").value || "-";
    document.getElementById("resServico").textContent = document.getElementById("servico").value || "-";
    document.getElementById("resData").textContent = document.getElementById("data").value || "-";
    document.getElementById("resHora").textContent = document.getElementById("hora").value || "-";
}

// =========================
// AO ESCOLHER DATA
// =========================
document.getElementById("data").addEventListener("change", () => {
    carregarHorariosDisponiveis();
    atualizarResumo();
});

// Atualiza resumo ao preencher os campos
["nome", "telefone", "servico"].forEach(id => {
    document.getElementById(id).addEventListener("input", atualizarResumo);
});

// =========================
// ENVIAR AGENDAMENTO
// =========================
document.getElementById("formAgendamento").addEventListener("submit", async e => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const observacao = document.getElementById("obs").value.trim();

    if(!nome || !telefone || !servico || !data || !hora){
        return alert("Preencha todos os campos obrigatórios!");
    }

    // Salva no banco
    await addDoc(collection(db, "agendamentos"), {
        nome, telefone, servico, data, hora, observacao, concluido: false
    });

    // Monta mensagem do WhatsApp
    const mensagem = `Olá! Quero agendar um horário:
👤 Nome: ${nome}
📱 WhatsApp: ${telefone}
💇 Serviço: ${servico}
📅 Data: ${data} às ${hora}
📝 Observação: ${observacao || 'Nenhuma observação'}`;

    const apenasNumeros = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${apenasNumeros}?text=${encodeURIComponent(mensagem)}`, "_blank");

    document.getElementById("mensagem-sucesso").classList.add("aberto");
    document.getElementById("formAgendamento").reset();
    atualizarResumo();
});

// =========================
// FECHAR POPUP
// =========================
document.getElementById("fecharPopup").addEventListener("click", () => {
    document.getElementById("mensagem-sucesso").classList.remove("aberto");
});

// INICIAR
carregarServicosNoAgendamento();