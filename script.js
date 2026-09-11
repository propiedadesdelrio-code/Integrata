/* =========================================================
   INTEGRATA - Scripts
   ========================================================= */

(function () {
  'use strict';

  /* ===== ANO DINÂMICO NO FOOTER ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ===== HEADER: SCROLL SHADOW ===== */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== MENU MOBILE ===== */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===== SCROLL SUAVE (fallback para navegadores antigos) ===== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset + 1;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ===== ANIMAÇÕES FADE-UP (IntersectionObserver) ===== */
  const fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback para navegadores antigos
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  /* ===== LINK ATIVO NO MENU CONFORME SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navMenu a[href^="#"]');

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}` && !link.classList.contains('nav-cta'));
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ===== MÁSCARA DE TELEFONE ===== */
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // (11) 99999-9999
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (11) 9999-9999
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2}).*/, '($1');
      }

      e.target.value = value;
    });
  }

  /* ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO ===== */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    const showFeedback = (message, type) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.className = `form-feedback ${type}`;
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const clearFeedback = () => {
      if (!feedback) return;
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    };

    const validateField = (field) => {
      let valid = true;

      if (field.hasAttribute('required') && !field.value.trim()) {
        valid = false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        valid = emailRegex.test(field.value.trim());
      }

      if (field.type === 'tel' && field.value.trim()) {
        const digits = field.value.replace(/\D/g, '');
        valid = digits.length >= 10;
      }

      field.classList.toggle('error', !valid);
      return valid;
    };

    // Validação em tempo real (blur)
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFeedback();

      const fields = form.querySelectorAll('input[required], textarea[required]');
      let allValid = true;

      fields.forEach((field) => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        showFeedback('⚠️ Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
        return;
      }

      // Simula envio (aqui você pode integrar com backend/API)
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      setTimeout(() => {
        showFeedback(
          '✅ Solicitação enviada com sucesso! Entraremos em contato em breve.',
          'success'
        );
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;

        // Limpa mensagem após 6 segundos
        setTimeout(clearFeedback, 6000);
      }, 1200);
    });
  }

  /* ===== EFEITO PARALLAX SUAVE NO HERO ===== */
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(min-width: 968px)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
        }
      },
      { passive: true }
    );
  }

  /* ===== LOG DE BOAS-VINDAS ===== */
  console.log(
    '%c🦷 Integrata – Centro de Referência em Saúde Odontológica',
    'color: #0a7ea4; font-size: 14px; font-weight: bold;'
  );
  console.log(
    '%cCNPJ: 18.811.074/0001-73 | Tel: (11) 2538-3681',
    'color: #5a6b72; font-size: 12px;'
  );
})();
