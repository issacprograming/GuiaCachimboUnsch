/* ══════════════════════════════════════════════════
   GUÍA CACHIMBO UNSCH — script.js
══════════════════════════════════════════════════ */

// ── 1. NAVBAR: sombra al hacer scroll + link activo ──
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const secciones = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sombra navbar
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Link activo según sección visible
  let actual = '';
  secciones.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) {
      actual = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('activo');
    if (link.getAttribute('href') === '#' + actual) {
      link.classList.add('activo');
    }
  });
});

// ── 2. MENÚ HAMBURGUESA (móvil) ──
const menuBtn = document.getElementById('menu-btn');
const navLinksMenu = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('abierto');
  navLinksMenu.classList.toggle('abierto');
});

// Cerrar menú al hacer clic en un enlace
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('abierto');
    navLinksMenu.classList.remove('abierto');
  });
});

// ── 3. ACCORDION GUÍA ──
document.querySelectorAll('.guia-card[data-id]').forEach(card => {
  const header = card.querySelector('.guia-card-header');
  if (!header) return;

  header.addEventListener('click', () => {
    const estaAbierto = card.classList.contains('abierto');

    // Cierra todos
    document.querySelectorAll('.guia-card.abierto').forEach(c => {
      c.classList.remove('abierto');
    });

    // Abre el clickeado si estaba cerrado
    if (!estaAbierto) {
      card.classList.add('abierto');
    }
  });
});

// ── 4. ACCORDION FACULTADES ──
document.querySelectorAll('.facultad-card-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.facultad-card');
    card.classList.toggle('abierto');
  });
});

// ── 5. ACCORDION ESCUELAS ──
document.querySelectorAll('.escuela-header').forEach(header => {
  header.addEventListener('click', (e) => {
    e.stopPropagation(); // No propagar al click de facultad
    const item = header.closest('.escuela-item');
    item.classList.toggle('abierto');
  });
});

// ── 6. ANIMACIÓN DE ENTRADA AL SCROLL ──
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observador.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Aplicar a tarjetas de guía y facultades
document.querySelectorAll('.guia-card, .facultad-card, .sobre-mi-wrapper').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observador.observe(el);
});

// Clase CSS que activa la animación
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);

// Stagger en tarjetas de guía (delay escalonado)
document.querySelectorAll('.guia-card').forEach((card, i) => {
  card.style.transitionDelay = `${(i % 3) * 80}ms`;
});

// ── 7. ANIMACIÓN CONTADORES DE ESTADÍSTICAS ──
const contadores = document.querySelectorAll('.stat-numero');

const animarContador = (el) => {
  const target = parseInt(el.getAttribute('data-target'));
  const duracion = 1800;
  const paso = target / (duracion / 16);
  let actual = 0;

  const timer = setInterval(() => {
    actual += paso;
    if (actual >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(actual);
    }
  }, 16);
};

// Activar solo cuando la sección es visible
const obsStats = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      contadores.forEach(animarContador);
      obsStats.disconnect();
    }
  });
}, { threshold: 0.3 });

const secStats = document.querySelector('.estadisticas');
if (secStats) obsStats.observe(secStats);
