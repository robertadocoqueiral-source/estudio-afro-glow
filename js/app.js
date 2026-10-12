// =========================
// ANIMAÇÃO DE ROLAGEM SUAVE
// =========================
document.querySelectorAll('a[href^="#"]').forEach(ancora => {
    ancora.addEventListener('click', function (e) {
        e.preventDefault();
        const alvo = document.querySelector(this.getAttribute('href'));
        if(alvo){
            alvo.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================
// ANIMAÇÃO APARECER AO ROLAR
// =========================
const elementos = document.querySelectorAll('.card, .diferencial, .cta-container, .card-galeria');

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting){
            entrada.target.style.opacity = '1';
            entrada.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

elementos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observador.observe(el);
});

// =========================
// DESTAQUE NO MENU DA PÁGINA ATUAL
// =========================
const caminho = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.menu a').forEach(link => {
    if(link.getAttribute('href') === caminho){
        link.classList.add('ativo');
    }
});

// =========================
// ANIMAÇÃO BOTÃO WHATSAPP
// =========================
const botaoWpp = document.querySelector('.whatsapp-fixo');
if(botaoWpp){
    setInterval(() => {
        botaoWpp.style.transform = 'scale(1.1)';
        setTimeout(() => {
            botaoWpp.style.transform = 'scale(1)';
        }, 600);
    }, 3000);
}

// =========================
// MENSAGEM DE CARREGAMENTO
// =========================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
document.body.style.transition = 'opacity 0.5s ease';
document.body.style.opacity = '0';