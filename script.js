// ============ MENU MOBILE ============
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // Fechar menu ao clicar em um link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });
}

// ============ HEADER SCROLL ============
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');

        // Fecha todos
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            const icon = faq.querySelector('.faq-icon');
            if (icon) icon.textContent = '+';
        });

        // Abre o clicado (se não estava aberto)
        if (!isActive) {
            item.classList.add('active');
            const icon = item.querySelector('.faq-icon');
            if (icon) icon.textContent = '+';
        }
    });
});

// ============ SCROLL REVEAL ============
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============ FORMULÁRIO DE CONTATO ============
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const especialidade = document.getElementById('especialidade').value;
        const mensagem = document.getElementById('mensagem').value;

        // Monta mensagem para o WhatsApp
        const texto = `Olá! Gostaria de agendar uma consulta.
        
*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}
*Especialidade:* ${especialidade || 'Não informada'}
*Mensagem:* ${mensagem || 'Sem mensagem adicional'}`;

        const url = `https://wa.me/5511972428315?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
        
        contactForm.reset();
        alert('Redirecionando para o WhatsApp...');
    });
}

// ============ ANO DINÂMICO NO FOOTER ============
const yearSpan = document.querySelector('.footer-copy span:first-child');
if (yearSpan) {
    yearSpan.textContent = `© ${new Date().getFullYear()} Portal do Sorriso. Todos os direitos reservados.`;
}
