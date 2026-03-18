// ── SMOOTH SCROLLING ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── PARALLAX BACKGROUND ──────────────────────────────────────
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.circuit-lines');
    if (parallax) parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// ── INTERSECTION OBSERVER (animaciones de entrada) ───────────
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// ── FORMULARIO ───────────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Consulta Enviada ✓';
            btn.style.background = 'linear-gradient(45deg, #00ff88, #00e5ff)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                this.reset();
            }, 3000);
        }, 2000);
    });
}

// ── TYPING TAGLINE ───────────────────────────────────────────
const tagline = document.querySelector('.tagline');
if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    setTimeout(typeWriter, 1000);
}

// ── HAMBURGER (script.js legacy) ─────────────────────────────
// NOTA: Este toggle está DESACTIVADO intencionalmente en mobile.
// El menú hamburguesa en mobile es manejado por el SIDEBAR (inline script en index.html).
// Este bloque queda solo como fallback para resoluciones >768px donde el sidebar no aplica.
const toggleBtn = document.getElementById('menu-toggle');
const navMenu   = document.getElementById('nav-menu');

if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
        // Solo actuar si el sidebar NO está disponible (desktop sin sidebar)
        const sidebar = document.getElementById('sidebar');
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && sidebar) {
            navMenu.classList.toggle('active');
        }
        // En mobile, el inline script del sidebar ya maneja esto con stopImmediatePropagation
    });
}

// ── MOBILE CURSOR ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const mobileCursor = document.getElementById('mobile-cursor');
    if (!mobileCursor) return;

    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    if (isTouchDevice()) {
        mobileCursor.style.display = 'block';
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (touch) {
                mobileCursor.style.left = `${touch.clientX}px`;
                mobileCursor.style.top  = `${touch.clientY}px`;
            }
        }, { passive: true });
    }
});

// ── CARRUSEL (ImprovedCarousel) ──────────────────────────────
// NOTA: Este carrusel está DESACTIVADO — el HTML ya tiene su propia
// lógica de carrusel (IIFE inline). Activar ambos causa doble control.
// Si quieres usar esta clase, elimina el IIFE del carrusel en index.html.
//
// class ImprovedCarousel { ... }  ← desactivado
