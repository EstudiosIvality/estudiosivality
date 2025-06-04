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




        const toggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });





    document.addEventListener("DOMContentLoaded", () => {
            const mobileCursor = document.getElementById('mobile-cursor');

            function isTouchDevice() {
                return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            }

            if (isTouchDevice()) {
                mobileCursor.style.display = 'block';

                document.addEventListener('touchmove', (e) => {
                    const touch = e.touches[0];
                    if (touch) {
                        mobileCursor.style.left = `${touch.clientX}px`;
                        mobileCursor.style.top = `${touch.clientY}px`;
                    }
                }, { passive: true });
            }
        });






class ImprovedCarousel {
  constructor() {
    this.carousel = document.querySelector('#carrusel');
    this.track = document.querySelector('.carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev');
    this.nextBtn = document.querySelector('.next');
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoSlideInterval = null;
    this.transitionTime = 700; // Debe coincidir con --transition-time en CSS
    
    this.init();
  }
  
  init() {
    // Configurar eventos
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Configurar indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        if (index !== this.currentIndex && !this.isAnimating) {
          this.goToSlide(index);
        }
      });
    });
    
    // Control por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
    
    // Autoplay
    this.startAutoSlide();
    
    // Pausar en hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
    
    // Touch events para móviles
    this.setupTouchEvents();
  }
  
  updateSlides(newIndex, direction) {
    this.isAnimating = true;
    
    // Actualizar clases de dirección
    this.track.classList.remove('sliding-left', 'sliding-right');
    this.track.classList.add(`sliding-${direction}`);
    
    // Actualizar slides
    this.slides[this.currentIndex].classList.remove('active', 'prev', 'next');
    this.slides[newIndex].classList.add('active');
    
    // Actualizar slides adyacentes para efecto 3D
    const prevIndex = (newIndex - 1 + this.slides.length) % this.slides.length;
    const nextIndex = (newIndex + 1) % this.slides.length;
    
    this.slides.forEach(slide => slide.classList.remove('prev', 'next'));
    this.slides[prevIndex].classList.add('prev');
    this.slides[nextIndex].classList.add('next');
    
    // Actualizar indicadores
    this.indicators.forEach(indicator => indicator.classList.remove('active'));
    this.indicators[newIndex].classList.add('active');
    
    this.currentIndex = newIndex;
    
    // Resetear animación
    setTimeout(() => {
      this.isAnimating = false;
      this.track.classList.remove('sliding-left', 'sliding-right');
    }, this.transitionTime);
  }
  
  nextSlide() {
    if (this.isAnimating) return;
    const newIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlides(newIndex, 'right');
  }
  
  prevSlide() {
    if (this.isAnimating) return;
    const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides(newIndex, 'left');
  }
  
  goToSlide(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    
    const direction = index > this.currentIndex ? 'right' : 'left';
    this.updateSlides(index, direction);
  }
  
  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, {passive: true});
  }
  
  handleSwipe() {
    const minSwipeDistance = 50;
    const distance = touchStartX - touchEndX;
    
    if (distance > minSwipeDistance) {
      this.nextSlide();
    } else if (distance < -minSwipeDistance) {
      this.prevSlide();
    }
  }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ImprovedCarousel();
});
