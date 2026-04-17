// ===== THEME TOGGLE =====
(function () {
    const toggle   = document.getElementById('theme-toggle');
    const icon     = document.getElementById('theme-icon');
    const root     = document.documentElement;
    const saved    = localStorage.getItem('theme') || 'dark';

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('theme', theme);
    }

    applyTheme(saved);

    toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        applyTheme(current === 'light' ? 'dark' : 'light');
    });
})();

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();


// Intersection Observer for scroll animations (fade in elements as they enter viewport)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements with the class 'fade-in'
document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in');
    faders.forEach(fader => {
        observer.observe(fader);
    });

    // Lightbox logic
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn    = document.getElementById('lightbox-close');

    document.querySelectorAll('.project-img-gallery img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Mobile Menu Toggle logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks      = document.querySelector('.nav-links');
    const navItems      = document.querySelectorAll('.nav-links li a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('toggle');
        });
    }

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('toggle');
            }
        });
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Neural Network Canvas Animation
const canvas = document.getElementById('neural-net');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // random velocity
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.fill();
        }
    }

    const calculateParticles = () => {
        particles = [];
        // More particles for wider screens, up to 100 max for performance
        const numParticles = Math.min(Math.floor((width * height) / 10000), 80);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    };
    calculateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculateParticles, 200);
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== COPY EMAIL BUTTONS =====
document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const email = btn.dataset.email;
        navigator.clipboard.writeText(email).then(() => {
            const span = btn.querySelector('span');
            btn.classList.add('copied');
            span.textContent = 'Copied!';
            setTimeout(() => {
                btn.classList.remove('copied');
                span.textContent = 'Copy';
            }, 2000);
        });
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fields = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];
        let valid = true;

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                el.classList.add('invalid');
                valid = false;
            } else {
                el.classList.remove('invalid');
            }
        });

        const emailEl = document.getElementById('contact-email');
        if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
            emailEl.classList.add('invalid');
            valid = false;
        }

        const status = document.getElementById('form-status');
        if (!valid) {
            status.textContent = 'Please fill in all fields correctly.';
            status.className = 'form-status error';
            return;
        }

        // Build mailto link with form data
        const name    = document.getElementById('contact-name').value.trim();
        const email   = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        const body = `Name: ${name}\nFrom: ${email}\n\n${message}`;
        const mailto = `mailto:albertankad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;

        status.textContent = 'Opening your email client...';
        status.className = 'form-status success';
        contactForm.reset();
        setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 4000);
    });

    // Remove invalid state on input
    contactForm.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => el.classList.remove('invalid'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    if (profilePic) {
        const images = [
            'Grad.jpeg',
            'Grad1.jpeg'
        ];
        let currentIndex = 0;

        setInterval(() => {
            // Fade out
            profilePic.style.opacity = 0;
            
            // Wait for fade out to finish, then change source and fade back in
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                profilePic.src = images[currentIndex];
                profilePic.style.opacity = 1;
            }, 500);
        }, 5000); // Change image every 5 seconds
    }
});
