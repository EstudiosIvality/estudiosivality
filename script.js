// Smooth scrolling para enlaces de navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Efecto parallax para el background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.circuit-lines');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        // Animación de entrada para las tarjetas
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar tarjetas de servicios y proyectos
        document.querySelectorAll('.service-card, .project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });

        // Manejo del formulario
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envío del formulario
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
                    btn.style.background = 'linear-gradient(45deg, var(--accent-cyan), var(--accent-orange))';
                    this.reset();
                }, 3000);
            }, 2000);
        });

        // Efecto de typing para el tagline
        const tagline = document.querySelector('.tagline');
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