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

// Contextual cursor
const cursorLabel = document.getElementById('cursorLabel');
const cursorClasses = ['cursor--view', 'cursor--go', 'cursor--type', 'cursor--violet', 'cursor--active'];

function setCursor(cls, label) {
    follower.classList.remove(...cursorClasses);
    if (cls) {
        follower.classList.add(cls, 'cursor--active');
        cursorLabel.textContent = label;
        cursor.style.background = cls === 'cursor--violet' ? 'var(--violet)' : 'var(--accent)';
        cursor.style.mixBlendMode = cls === 'cursor--violet' ? 'normal' : 'difference';
    } else {
        cursorLabel.textContent = '';
        cursor.style.background = 'var(--accent)';
        cursor.style.mixBlendMode = 'difference';
    }
}

const cursorZones = [
    { selector: '.project',                                                    label: 'VIEW →',  cls: 'cursor--view'   },
    { selector: '.nav-link, .nav-mobile-link, .footer-social',                 label: 'GO →',    cls: 'cursor--go'     },
    { selector: '.nav-logo, .footer-logo',                                     label: 'HOME',    cls: 'cursor--go'     },
    { selector: 'input, textarea, select',                                     label: 'ÉCRIRE',  cls: 'cursor--type'   },
    { selector: '.btn-submit',                                                 label: 'ENVOYER', cls: 'cursor--violet'  },
    { selector: '.link-arrow',                                                 label: 'VOIR →',  cls: 'cursor--violet'  },
];

cursorZones.forEach(({ selector, label, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => setCursor(cls, label));
        el.addEventListener('mouseleave', () => setCursor(null, ''));
    });
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
// HERO ANIMATIONS
// ============================================
function animateHero() {
    const elements = document.querySelectorAll('.hero [data-animate]');
    elements.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 400 + i * 150);
    });
}

// ============================================
// HERO — TOPO + LOGO SVG MASK (canvas compositing)
// ============================================
(function initHero() {
    const canvas = document.getElementById('topo');
    if (!canvas) return;
    const ctx        = canvas.getContext('2d');
    const heroEl     = document.getElementById('hero');
    const heroInfo   = document.getElementById('heroInfo');
    const scrollHint = document.getElementById('scrollHint');

    let W, H;
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // — Logo SVG (viewBox 900 750 1700 1000) —
    // Bounding box du contenu : x=947→2560, y=785→1695
    const LOGO_X  = 947.266;
    const LOGO_Y  = 785.229;
    const LOGO_W  = 1613.342; // 2560.608 - 947.266
    const LOGO_H  = 909.858;  // 1695.087 - 785.229
    const LOGO_CX = LOGO_X + LOGO_W / 2; // 1753.937
    const LOGO_CY = LOGO_Y + LOGO_H / 2; // 1240.158

    const logoRect1 = new Path2D();
    logoRect1.rect(947.266, 785.229, 455.854, 909.858);

    const logoRect2 = new Path2D();
    logoRect2.rect(2312.851, 785.229, 247.757, 247.757);

    const logoCurve = new Path2D(
        'M1875.868,785.229c0,238.817 196.310,431.783 436.983,431.783' +
        'l0,474.725c-503.691,0 -911.709,-406.702 -911.709,-906.509l474.725,0Z'
    );

    const logoPath = new Path2D();
    logoPath.addPath(logoRect1);
    logoPath.addPath(logoRect2);
    logoPath.addPath(logoCurve);

    // — Champ de hauteur topo —
    function field(x, y, t) {
        return (
            Math.sin(x * 0.008  + t * 0.40) * 0.32 +
            Math.sin(y * 0.010  + t * 0.28) * 0.24 +
            Math.sin((x + y)    * 0.006 + t * 0.55) * 0.20 +
            Math.sin((x * 0.7 - y * 0.5) * 0.009 + t * 0.45) * 0.14 +
            Math.sin((x * 0.4 + y * 0.9) * 0.005 + t * 0.32) * 0.10
        );
    }

    const LEVELS = 20;
    const CELL   = 14;

    function drawTopoLines(t) {
        const cols = Math.ceil(W / CELL) + 2;
        const rows = Math.ceil(H / CELL) + 2;
        const g = [];
        for (let r = 0; r < rows; r++) {
            g[r] = [];
            for (let c = 0; c < cols; c++) g[r][c] = field(c * CELL, r * CELL, t);
        }
        for (let lv = 0; lv < LEVELS; lv++) {
            const thr  = -0.85 + (lv / (LEVELS - 1)) * 1.7;
            const prox = 1 - Math.abs(thr) / 0.85;
            ctx.strokeStyle = `rgba(173,255,0,${0.1 + prox * 0.65})`;
            ctx.lineWidth   = lv % 4 === 0 ? 1.4 : 0.55;
            ctx.beginPath();
            for (let r = 0; r < rows - 1; r++) {
                for (let c = 0; c < cols - 1; c++) {
                    const v00=g[r][c], v10=g[r][c+1], v01=g[r+1][c], v11=g[r+1][c+1];
                    const idx=(v00>thr?8:0)|(v10>thr?4:0)|(v11>thr?2:0)|(v01>thr?1:0);
                    if (idx===0||idx===15) continue;
                    const ox=c*CELL, oy=r*CELL;
                    const s=(a,b)=>Math.abs(b-a)<1e-9?0.5:(thr-a)/(b-a);
                    const T={x:ox+s(v00,v10)*CELL,y:oy}, R={x:ox+CELL,y:oy+s(v10,v11)*CELL};
                    const B={x:ox+s(v01,v11)*CELL,y:oy+CELL}, L={x:ox,y:oy+s(v00,v01)*CELL};
                    const tbl={1:[[L,B]],2:[[B,R]],3:[[L,R]],4:[[R,T]],5:[[L,T],[R,B]],
                        6:[[B,T]],7:[[L,T]],8:[[T,L]],9:[[T,B]],10:[[T,R],[B,L]],
                        11:[[T,R]],12:[[R,L]],13:[[R,B]],14:[[B,L]]};
                    for (const [a,b] of (tbl[idx]||[])) { ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); }
                }
            }
            ctx.stroke();
        }
    }

    // — Scroll —
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        if (!heroEl) return;
        const total = heroEl.offsetHeight - window.innerHeight;
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / total));
        const fade = Math.max(0, 1 - scrollProgress * 4);
        if (heroInfo)   heroInfo.style.opacity   = fade;
        if (scrollHint) scrollHint.style.opacity = fade;
    }, { passive: true });

    // — Boucle —
    let time = 0;

    function frame() {
        time += 0.007;
        ctx.clearRect(0, 0, W, H);

        // 1. Fond noir
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        // 3. Masque logo : clip + topo à l'intérieur
        const baseScale = Math.min(W / LOGO_W, H / LOGO_H) * 0.65;
        const scale     = baseScale * (1 + scrollProgress * 5);
        const tx        = W / 2 - LOGO_CX * scale;
        const ty        = H / 2 - LOGO_CY * scale;

        ctx.save();
        ctx.setTransform(scale, 0, 0, scale, tx, ty);
        ctx.clip(logoPath);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawTopoLines(time);
        ctx.restore();
        requestAnimationFrame(frame);
    }
    frame();
})();

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
