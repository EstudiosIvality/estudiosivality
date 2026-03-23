// script.js — Estudios Ivality

// smooth scroll para los links del nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // animaciones de entrada al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.service-card, .project-card').forEach(card => {
        observer.observe(card);
    });

    // efecto de escritura en el tagline del header
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i++);
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 1000);
    }

    // formulario de contacto — feedback visual al enviar
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn');
            const original = btn.textContent;
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Consulta Enviada ✓';
                btn.style.background = 'linear-gradient(45deg, #00ff88, #00e5ff)';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.disabled = false;
                    btn.style.background = '';
                    this.reset();
                }, 3000);
            }, 2000);
        });
    }

    // cursor táctil para dispositivos móviles
    const mobileCursor = document.getElementById('mobile-cursor');
    if (mobileCursor && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        mobileCursor.style.display = 'block';
        document.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            if (t) {
                mobileCursor.style.left = `${t.clientX}px`;
                mobileCursor.style.top  = `${t.clientY}px`;
            }
        }, { passive: true });
    }

    // sidebar móvil
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const toggle   = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('sidebar-close');

    if (sidebar && overlay && toggle && closeBtn) {
        overlay.style.display = 'block';
        overlay.style.pointerEvents = 'none';

        const openSidebar = () => {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
            overlay.style.pointerEvents = 'all';
            toggle.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            overlay.style.pointerEvents = 'none';
            toggle.classList.remove('open');
            document.body.style.overflow = '';
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });

        closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeSidebar(); });
        overlay.addEventListener('click', closeSidebar);
        document.querySelectorAll('.sidebar-link').forEach(l => l.addEventListener('click', closeSidebar));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });
    }

    // switch de tema claro/oscuro
    const THEME_KEY = 'ivality-theme';

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    };

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    };

    document.getElementById('theme-switch-desktop')?.addEventListener('click', toggleTheme);
    document.getElementById('theme-switch-sidebar')?.addEventListener('click', toggleTheme);

    // =========================================================
    // CARRUSEL DE LA GALERÍA — versión corregida
    // =========================================================
    const track = document.getElementById('gallery-track');
    if (track) {
        const slides    = track.querySelectorAll('.carousel-slide');
        const container = document.getElementById('gallery-indicators');
        let current     = 0;
        let timer;
        const INTERVAL  = 5000;

        // ── 1. Precargar todos los videos del carrusel ──────────
        // Chrome/Safari suspenden la carga de videos ocultos (opacity:0).
        // Forzamos preload="metadata" en todos y load() para arrancar la
        // descarga aunque el slide esté invisible.
        slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) {
                video.preload  = 'metadata'; // carga cabeceras + primer frame
                video.muted    = true;
                video.playsInline = true;
                video.load();              // dispara la petición HTTP aunque esté oculto
            }
        });

        // ── 2. Generar los puntitos indicadores ─────────────────
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'indicator' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
            btn.addEventListener('click', () => goTo(i));
            container.appendChild(btn);
        });

        // ── 3. Reproducir video de forma segura ─────────────────
        // Espera a que el video tenga datos suficientes (readyState >= 2)
        // antes de llamar a .play(), evitando la pantalla negra.
        const playVideo = (video) => {
            if (!video) return;
            video.muted       = true;
            video.currentTime = 0;

            const attemptPlay = () => {
                const p = video.play();
                if (p !== undefined) {
                    p.catch(() => {
                        // Segundo intento silencioso si falla (política autoplay)
                        video.muted = true;
                        video.play().catch(() => {});
                    });
                }
            };

            // readyState 2 = HAVE_CURRENT_DATA, suficiente para reproducir
            if (video.readyState >= 2) {
                attemptPlay();
            } else {
                // Escuchar el primer evento en que haya datos disponibles
                video.addEventListener('canplay', attemptPlay, { once: true });
                // Si aún no inició la carga, dispararla ahora
                if (video.networkState === HTMLMediaElement.NETWORK_EMPTY ||
                    video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
                    video.load();
                }
            }
        };

        // ── 4. Lógica de navegación ──────────────────────────────
        const goTo = (n) => {
            const dots = container.querySelectorAll('.indicator');

            // Pausar y resetear el video que se va
            const prevVideo = slides[current].querySelector('video');
            if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }

            slides[current].classList.remove('active');
            dots[current].classList.remove('active');

            current = (n + slides.length) % slides.length;

            slides[current].classList.add('active');
            dots[current].classList.add('active');

            // Reproducir el video que entra (ya precargado gracias al paso 1)
            const nextVideo = slides[current].querySelector('video');
            if (nextVideo) playVideo(nextVideo);

            resetTimer();
        };

        const resetTimer = () => {
            clearInterval(timer);
            timer = setInterval(() => goTo(current + 1), INTERVAL);
        };

        // ── 5. Flechas de navegación ─────────────────────────────
        const wrap = track.closest('.carousel-container');
        wrap.querySelector('.carousel-control.prev').addEventListener('click', () => goTo(current - 1));
        wrap.querySelector('.carousel-control.next').addEventListener('click', () => goTo(current + 1));

        // ── 6. Swipe táctil ──────────────────────────────────────
        let startX = 0;
        wrap.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        wrap.addEventListener('touchend',   (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
        }, { passive: true });

        // ── 7. Arrancar con el primer slide ──────────────────────
        const firstVideo = slides[0].querySelector('video');
        if (firstVideo) playVideo(firstVideo);
        resetTimer();
    }

});
