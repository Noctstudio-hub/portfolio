// ============================================
// FORCE SCROLL TO TOP
// ============================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.addEventListener('DOMContentLoaded', () => window.scrollTo(0, 0));

// ============================================
// LOADER
// ============================================
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.body.style.overflow = '';
        animateHero();
    }, 1200);
});

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX - 20 + 'px';
    follower.style.top = followerY - 20 + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .project');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
});

// ============================================
// NAVIGATION (Sonido pattern — dropdown menu)
// ============================================
const nav = document.getElementById('nav');
const navMenu = document.getElementById('navMenu');
const navMobile = document.getElementById('navMobile');
const mobileLinks = document.querySelectorAll('.nav-mobile-link');

navMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navMobile.classList.toggle('open');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navMobile.classList.remove('open');
    });
});

// ============================================
// HERO TILES
// ============================================
(function buildHeroTiles() {
    const container = document.getElementById('heroTiles');
    if (!container) return;

    const cols = 7;
    // Staggered starting offsets — larger = arrives from further down
    const offsets = [150, 280, 100, 250, 130, 300, 180];

    for (let i = 0; i < cols; i++) {
        const tile = document.createElement('div');
        tile.className = 'hero-tile';
        tile.style.transform = 'translateY(' + offsets[i] + 'px)';
        tile.style.backgroundPosition = ((i / (cols - 1)) * 100) + '% center';
        tile.style.backgroundSize = (cols * 100) + '% auto';
        container.appendChild(tile);
    }
})();

// ============================================
// HERO ANIMATIONS
// ============================================
function animateHero() {
    const tiles = document.querySelectorAll('.hero-tile');
    tiles.forEach((tile, i) => {
        setTimeout(() => {
            tile.classList.add('visible');
        }, i * 100);
    });

    const textDelay = tiles.length * 100 + 200;
    const elements = document.querySelectorAll('.hero [data-animate]');
    elements.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, textDelay + i * 120);
    });
}

// ============================================
// SCROLL REVEAL
// ============================================
const animatedElements = document.querySelectorAll('[data-animate]:not(.hero [data-animate])');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

animatedElements.forEach(el => observer.observe(el));

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
// CONTACT FORM
// ============================================
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const original = btn.innerHTML;

    btn.innerHTML = '<span>Envoi en cours...</span>';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.innerHTML = '<span>Message envoyé !</span>';
        btn.style.opacity = '1';
        btn.style.background = '#22c55e';

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.pointerEvents = '';
            btn.style.background = '';
            form.reset();
        }, 3000);
    }, 1500);
});

// ============================================
// MAGNETIC EFFECT ON PROJECTS (Desktop)
// ============================================
if (window.innerWidth > 768) {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('mousemove', (e) => {
            const rect = project.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 30;
            const moveY = (y - centerY) / 30;

            project.style.transform = `translateY(-4px) translate(${moveX}px, ${moveY}px)`;
        });

        project.addEventListener('mouseleave', () => {
            project.style.transform = '';
        });
    });
}
