/* ==========================================
   Main JavaScript — Raj Industries
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHeroCarousel();
    initScrollAnimations();
    initStatsCounter();
    initScrollTopButton();
    initInfiniteCarousels(); // 🔥 NEW (NO GAP CAROUSEL)
});

/* ------------------------------------------
   Header: scroll effect + mobile menu
------------------------------------------ */
function initHeader() {
    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-overlay');

    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/* ------------------------------------------
   Hero Carousel
------------------------------------------ */
function initHeroCarousel() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const slides = hero.querySelectorAll('.hero-slide');
    const heroText = hero.querySelector('.hero-text');
    const indicators = hero.querySelectorAll('.hero-indicator');
    const prevBtn = hero.querySelector('.hero-arrow--prev');
    const nextBtn = hero.querySelector('.hero-arrow--next');

    if (slides.length === 0) return;

    let current = 0;
    let isTransitioning = false;
    let autoplayTimer;

    function goTo(index) {
        if (isTransitioning || index === current) return;
        isTransitioning = true;

        if (heroText) heroText.classList.add('transitioning');

        setTimeout(() => {
            slides[current].classList.remove('active');
            indicators[current]?.classList.remove('active');

            current = index;

            slides[current].classList.add('active');
            indicators[current]?.classList.add('active');

            updateHeroText(current);

            setTimeout(() => {
                if (heroText) heroText.classList.remove('transitioning');
                isTransitioning = false;
            }, 100);
        }, 500);

        resetAutoplay();
    }

    function updateHeroText(index) {
        const slide = slides[index];
        const category = slide.dataset.category || '';
        const headline = slide.dataset.headline || '';
        const href = slide.dataset.href || '#';

        const catEl = heroText?.querySelector('.hero-text__category');
        const headEl = heroText?.querySelector('.hero-text__headline');
        const ctaEl = heroText?.querySelector('.hero-text__cta');

        if (catEl) catEl.textContent = category;
        if (headEl) headEl.textContent = headline;
        if (ctaEl) ctaEl.href = href;
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    function prev() {
        goTo(current === 0 ? slides.length - 1 : current - 1);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(next, 6000);
    }

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    indicators.forEach((btn, i) => {
        btn.addEventListener('click', () => goTo(i));
    });

    resetAutoplay();
}

/* ------------------------------------------
   Scroll-triggered Animations
------------------------------------------ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-animate, .scroll-animate-right, .product-home-card, .stat-item, .value-card');

    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

/* ------------------------------------------
   Stats Counter Animation
------------------------------------------ */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-item__number[data-target]');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, suffix);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + suffix;
        }
    }, 16);
}

/* ------------------------------------------
   Scroll to Top Button
------------------------------------------ */
function initScrollTopButton() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ------------------------------------------
   🔥 Infinite Logo Carousel (NO GAP)
------------------------------------------ */
function initInfiniteCarousels() {
    const tracks = document.querySelectorAll('.carousel-track');

    tracks.forEach(track => {
        const items = Array.from(track.children);

        // Clone items for seamless loop
        items.forEach(item => {
            track.appendChild(item.cloneNode(true));
        });

        let position = 0;
        const speed = 0.4;

        const isReverse = track.classList.contains('right');

        // 🔥 FIX: start from half width (no blank space)
        const startOffset = track.scrollWidth /2;
        position = startOffset;

        function animate() {
            position += speed;

            if (isReverse) {
                track.style.transform = `translateX(${position}px)`;
            } else {
                track.style.transform = `translateX(-${position}px)`;
            }

            // Reset smoothly
            if (position >= track.scrollWidth) {
                position = startOffset;
            }

            requestAnimationFrame(animate);
        }

        animate();
    });
}