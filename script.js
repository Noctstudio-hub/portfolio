// ============================================
// PRELOADER
// ============================================
const preloader = document.getElementById('preloader');
const preloaderCounter = document.getElementById('preloaderCounter');
const preloaderBar = document.getElementById('preloaderBar');
let count = 0;

const counterInterval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) {
        count = 100;
        clearInterval(counterInterval);
        setTimeout(() => {
            preloader.classList.add('hidden');
            animateHero();
        }, 400);
    }
    preloaderCounter.textContent = count;
    preloaderBar.style.width = count + '%';
}, 60);

// ============================================
// NAVIGATION
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-menu-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ============================================
// HERO ANIMATIONS
// ============================================
function animateHero() {
    const elements = document.querySelectorAll('.hero [data-reveal]');
    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, i * 150);
    });

    // Animate title lines
    const titleLines = document.querySelectorAll('.hero-title-line span');
    titleLines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(100%)';
        line.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.12}s`;
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 50);
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealElements = document.querySelectorAll('[data-reveal]:not(.hero [data-reveal])');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// FAQ ACCORDION
// ============================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => i.classList.remove('active'));

        // Open clicked if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// CONTACT FORM
// ============================================
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.innerHTML = '<span>Message envoyé !</span>';
        btn.style.opacity = '1';
        btn.style.background = '#22c55e';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.pointerEvents = '';
            btn.style.background = '';
            form.reset();
        }, 3000);
    }, 1500);
});

// ============================================
// PARALLAX EFFECT ON HERO (Desktop)
// ============================================
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.15}px)`;
            hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    });
}

// ============================================
// PROJECT CARDS TILT EFFECT (Desktop)
// ============================================
if (window.innerWidth > 1024) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 4;
            const tiltY = (x - 0.5) * -4;

            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
