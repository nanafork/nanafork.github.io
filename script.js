// ===== ACADEMICPAGES INTERACTIVITY & MOBILE SCRIPT =====
// For Albert Ankomah Dodoo Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 0. Dark / Light Mode Switcher
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    function updateThemeToggleUI(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
            themeToggleBtn.setAttribute('title', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            themeToggleBtn.setAttribute('title', 'Switch to dark mode');
        }
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeToggleUI(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleUI(newTheme);
        });
    }

    // 1. Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Toggle & Outside Tap to Close
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const masthead = document.querySelector('.masthead');

    if (navToggleBtn && navMenu) {
        function toggleNav() {
            const isActive = navMenu.classList.toggle('active');
            const icon = navToggleBtn.querySelector('i');
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }

        function closeNav() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }

        navToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });

        // Close menu when clicking any nav item
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close menu when tapping outside of masthead
        document.addEventListener('click', (e) => {
            if (masthead && !masthead.contains(e.target)) {
                closeNav();
            }
        });

        // Close menu when window resizes to desktop width
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeNav();
            }
        });

        // Also close nav when scrolling on mobile (better UX)
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) {
                closeNav();
            }
        }, { passive: true });
    }

    // 3. Smooth Scrolling with Dynamic Fixed Header Clearance
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = masthead ? masthead.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 15);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Lightbox Modal for Enlargeable Images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        document.querySelectorAll('.enlargeable-img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Enlarged image';
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // 4b. Smooth Horizontal Scroll on Mouse Wheel for Galleries
    document.querySelectorAll('.project-gallery').forEach(gallery => {
        gallery.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0 && gallery.scrollWidth > gallery.clientWidth) {
                e.preventDefault();
                gallery.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });

    // 5. Talks & Gallery Carousel with Touch / Swipe Support
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const slides = Array.from(track.children);
        const total = slides.length;
        let current = 0;
        let autoTimer = null;

        // Build pagination dots
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        function goTo(index) {
            current = (index + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        function goNext() { goTo(current + 1); }
        function goPrev() { goTo(current - 1); }

        nextBtn.addEventListener('click', goNext);
        prevBtn.addEventListener('click', goPrev);

        // Autoplay logic (pause on touch or hover)
        const carouselWrapper = track.closest('.talks-carousel');
        if (carouselWrapper) {
            function startAuto() {
                stopAuto();
                autoTimer = setInterval(goNext, 4500);
            }
            function stopAuto() {
                if (autoTimer) {
                    clearInterval(autoTimer);
                    autoTimer = null;
                }
            }

            carouselWrapper.addEventListener('mouseenter', stopAuto);
            carouselWrapper.addEventListener('mouseleave', startAuto);
            carouselWrapper.addEventListener('touchstart', stopAuto, { passive: true });
            carouselWrapper.addEventListener('touchend', startAuto, { passive: true });
            startAuto();
        }

        // Mobile Touch Gestures (Swipe Left / Right)
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Only trigger horizontal swipe if movement is predominantly horizontal
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
                if (deltaX > 0) {
                    goNext(); // swiped left
                } else {
                    goPrev(); // swiped right
                }
            }
        }, { passive: true });
    }

    // 6. Interactive Contact Form & Copy Email
    const contactForm = document.getElementById('contact-quick-form');
    const gmailBtn = document.getElementById('btn-send-gmail');
    const targetEmail = 'albertankad@gmail.com';

    if (contactForm) {
        function buildEmailContent() {
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim() || 'Inquiry from Public Profile';
            const message = document.getElementById('contact-message').value.trim();

            const body = `Hi Albert,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`;
            return { name, email, subject, body };
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const { subject, body } = buildEmailContent();
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
        });

        if (gmailBtn) {
            gmailBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('contact-name');
                const messageInput = document.getElementById('contact-message');

                if (!nameInput.checkValidity() || !messageInput.checkValidity()) {
                    contactForm.reportValidity();
                    return;
                }

                const { subject, body } = buildEmailContent();
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, '_blank', 'noopener,noreferrer');
            });
        }
    }

    // Copy Email to Clipboard with visual feedback
    document.querySelectorAll('.copy-email-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const email = btn.getAttribute('data-email') || targetEmail;
            try {
                await navigator.clipboard.writeText(email);
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
                }, 2000);
            }
        });
    });

    // 8. Interactive Draggable Constellation Network Graph
    initConstellationGraph();
});

/**
 * Interactive Spring-Physics Constellation Graph
 * Renders draggable contact & social profile nodes connected by elastic springs.
 */
function initConstellationGraph() {
    const canvas = document.getElementById('constellation-canvas');
    const tooltip = document.getElementById('constellation-tooltip');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI Canvas Scaling
    const width = 240;
    const height = 205;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // 5 Circular Nodes matching user uploaded network layout (horizontally and vertically centered)
    const nodes = [
        {
            id: 'in',
            label: 'LinkedIn Profile',
            url: 'https://www.linkedin.com/in/albert-ankomah-dodoo/',
            homeX: 100,
            homeY: 32,
            x: 100,
            y: 32,
            vx: 0,
            vy: 0,
            radius: 20,
            ringColor: '#4f5fc7',
            isDragging: false,
            isHovered: false
        },
        {
            id: 'cv',
            label: 'Curriculum Vitae (PDF)',
            url: 'Curriculum Vitae_Albert Ankomah Dodoo.pdf',
            homeX: 62,
            homeY: 86,
            x: 62,
            y: 86,
            vx: 0,
            vy: 0,
            radius: 20,
            ringColor: '#9b3ba8',
            isDragging: false,
            isHovered: false
        },
        {
            id: 'scholar',
            label: 'Google Scholar',
            url: 'https://scholar.google.com/citations?user=8UJVMjUAAAAJ&hl=en&oi=ao',
            homeX: 178,
            homeY: 120,
            x: 178,
            y: 120,
            vx: 0,
            vy: 0,
            radius: 20,
            ringColor: '#279f53',
            isDragging: false,
            isHovered: false
        },
        {
            id: 'github',
            label: 'GitHub Profile',
            url: 'https://github.com/nanafork',
            homeX: 120,
            homeY: 140,
            x: 120,
            y: 140,
            vx: 0,
            vy: 0,
            radius: 20,
            ringColor: '#702728',
            isDragging: false,
            isHovered: false
        },
        {
            id: 'email',
            label: 'Email Albert (albertankad@gmail.com)',
            url: 'mailto:albertankad@gmail.com',
            homeX: 68,
            homeY: 174,
            x: 68,
            y: 174,
            vx: 0,
            vy: 0,
            radius: 20,
            ringColor: '#8c992f',
            isDragging: false,
            isHovered: false
        }
    ];

    // 7 Spring Edges matching reference network topology:
    // (in-cv, in-scholar, in-github, cv-github, cv-email, scholar-github, github-email)
    const edgeDefs = [
        { s: 0, t: 1 },
        { s: 0, t: 2 },
        { s: 0, t: 3 },
        { s: 1, t: 3 },
        { s: 1, t: 4 },
        { s: 2, t: 3 },
        { s: 3, t: 4 }
    ];

    const edges = edgeDefs.map(e => {
        const u = nodes[e.s];
        const v = nodes[e.t];
        return {
            source: u,
            target: v,
            restLength: Math.hypot(v.homeX - u.homeX, v.homeY - u.homeY)
        };
    });

    // Vector Octocat path for GitHub node
    const octocatPath = new Path2D(
        'M0 -11 C-6.1 -11 -11 -6.1 -11 0 C-11 4.9 -7.8 9 -3.4 10.5 C-2.8 10.6 -2.6 10.2 -2.6 9.9 ' +
        'C-2.6 9.6 -2.6 8.7 -2.6 7.6 C-5.7 8.3 -6.3 6.8 -6.3 6.8 C-6.8 5.5 -7.6 5.1 -7.6 5.1 ' +
        'C-8.6 4.4 -7.5 4.4 -7.5 4.4 C-6.4 4.5 -5.8 5.6 -5.8 5.6 C-4.8 7.3 -3.2 6.8 -2.6 6.5 ' +
        'C-2.5 5.8 -2.2 5.3 -1.9 5 C-4.3 4.7 -6.9 3.5 -6.9 -0.6 C-6.9 -1.8 -6.5 -2.7 -5.8 -3.5 ' +
        'C-5.9 -3.8 -6.3 -5.1 -5.7 -6.8 C-5.7 -6.8 -4.8 -7.1 -2.7 -5.7 C-1.8 -6 -0.9 -6.1 0 -6.1 ' +
        'C0.9 -6.1 1.8 -6 2.7 -5.7 C4.8 -7.1 5.7 -6.8 5.7 -6.8 C6.3 -5.1 5.9 -3.8 5.8 -3.5 ' +
        'C6.5 -2.7 6.9 -1.8 6.9 -0.6 C6.9 3.5 4.3 4.7 1.9 5 C2.3 5.3 2.6 6 2.6 6.9 ' +
        'C2.6 8.2 2.6 9.3 2.6 9.9 C2.6 10.2 2.8 10.6 3.4 10.5 C7.8 9 11 4.9 11 0 C11 -6.1 6.1 -11 0 -11 Z'
    );

    // Physics Simulation Update Step
    function updatePhysics() {
        // 1. Hooke's Law Spring forces between connected nodes
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const u = edge.source;
            const v = edge.target;
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const displacement = dist - edge.restLength;
            const force = displacement * 0.038;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!u.isDragging) {
                u.vx += fx;
                u.vy += fy;
            }
            if (!v.isDragging) {
                v.vx -= fx;
                v.vy -= fy;
            }
        }

        // 2. Tether each node elastically to its home position, handle collisions and damping
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.isDragging) {
                node.vx = 0;
                node.vy = 0;
                continue;
            }

            // Elastic pull toward home anchor
            const hdx = node.homeX - node.x;
            const hdy = node.homeY - node.y;
            node.vx += hdx * 0.042;
            node.vy += hdy * 0.042;

            // Collision avoidance between nodes
            for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const cdx = other.x - node.x;
                const cdy = other.y - node.y;
                const cdist = Math.hypot(cdx, cdy) || 0.001;
                const minDist = node.radius + other.radius + 3;
                if (cdist < minDist) {
                    const overlap = (minDist - cdist) * 0.5;
                    const nx = (cdx / cdist) * overlap;
                    const ny = (cdy / cdist) * overlap;
                    if (!node.isDragging) {
                        node.x -= nx;
                        node.y -= ny;
                    }
                    if (!other.isDragging) {
                        other.x += nx;
                        other.y += ny;
                    }
                }
            }

            // Damping decay
            node.vx *= 0.82;
            node.vy *= 0.82;

            // Integrate position
            node.x += node.vx;
            node.y += node.vy;

            // Boundary clamping within canvas
            const pad = node.radius + 3;
            if (node.x < pad) { node.x = pad; node.vx = 0; }
            if (node.x > width - pad) { node.x = width - pad; node.vx = 0; }
            if (node.y < pad) { node.y = pad; node.vy = 0; }
            if (node.y > height - pad) { node.y = height - pad; node.vy = 0; }
        }
    }

    // Render Function
    function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // Draw spring connection lines
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            const u = edge.source;
            const v = edge.target;
            const isHot = u.isDragging || v.isDragging || u.isHovered || v.isHovered;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(u.x, u.y);
            ctx.lineTo(v.x, v.y);
            ctx.strokeStyle = isHot ? (isDark ? '#94a3b8' : '#64748b') : (isDark ? '#475569' : '#cbd5e1');
            ctx.lineWidth = isHot ? 2.2 : 1.8;
            ctx.stroke();
            ctx.restore();
        }

        // Draw circular nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            ctx.save();

            // Drop shadow for interactive feedback
            if (node.isDragging || node.isHovered) {
                ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.2)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 3;
            }

            // Clean inner fill (adapts to light/dark background)
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
            ctx.fill();

            // Colored outer ring
            ctx.strokeStyle = node.ringColor;
            ctx.lineWidth = node.isDragging ? 4.5 : 3.8;
            ctx.stroke();

            // Reset shadow before drawing inner icon/emblem
            ctx.shadowColor = 'transparent';

            // Draw crisp vector icon inside
            drawNodeIcon(node);

            ctx.restore();
        }
    }

    // Draw Vector Icon / Typography inside Node
    function drawNodeIcon(node) {
        const cx = node.x;
        const cy = node.y;

        if (node.id === 'in') {
            // LinkedIn "in" bold typography
            ctx.fillStyle = node.ringColor;
            ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('in', cx, cy + 0.5);
        } else if (node.id === 'cv') {
            // Curriculum Vitae "cv" bold typography
            ctx.fillStyle = node.ringColor;
            ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('cv', cx, cy + 0.5);
        } else if (node.id === 'scholar') {
            // Google Scholar multi-color geometric academic cap
            // Yellow lower circle / neck
            ctx.beginPath();
            ctx.arc(cx, cy + 4.5, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbc04';
            ctx.fill();

            // Top diamond: Left Blue
            ctx.beginPath();
            ctx.moveTo(cx - 9, cy - 2);
            ctx.lineTo(cx, cy - 8);
            ctx.lineTo(cx, cy - 1);
            ctx.closePath();
            ctx.fillStyle = '#2b76dc';
            ctx.fill();

            // Top diamond: Right Red
            ctx.beginPath();
            ctx.moveTo(cx + 9, cy - 2);
            ctx.lineTo(cx, cy - 8);
            ctx.lineTo(cx, cy - 1);
            ctx.closePath();
            ctx.fillStyle = '#df4432';
            ctx.fill();

            // Bottom diamond neck: Green
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy - 1);
            ctx.lineTo(cx + 6, cy - 1);
            ctx.lineTo(cx, cy + 3.2);
            ctx.closePath();
            ctx.fillStyle = '#239e53';
            ctx.fill();
        } else if (node.id === 'github') {
            // GitHub Octocat silhouette
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(0.85, 0.85);
            ctx.fillStyle = node.ringColor;
            ctx.fill(octocatPath);
            ctx.restore();
        } else if (node.id === 'email') {
            // Email envelope outline with V flap
            ctx.save();
            ctx.translate(cx, cy);
            ctx.strokeStyle = node.ringColor;
            ctx.lineWidth = 1.7;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            const w = 9;
            const h = 6.2;
            ctx.strokeRect(-w, -h, w * 2, h * 2);
            ctx.beginPath();
            ctx.moveTo(-w, -h);
            ctx.lineTo(0, 0.8);
            ctx.lineTo(w, -h);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Pointer Interaction & Drag Physics
    let activeNode = null;
    let pointerDownPos = { x: 0, y: 0 };
    let hasDragged = false;

    function getCanvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function findNodeAt(x, y) {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
            if (Math.hypot(n.x - x, n.y - y) <= n.radius + 6) {
                return n;
            }
        }
        return null;
    }

    function showTooltip(node) {
        if (!tooltip) return;
        if (node) {
            tooltip.textContent = node.label;
            tooltip.style.left = node.x + 'px';
            tooltip.style.top = (node.y - node.radius - 8) + 'px';
            tooltip.classList.add('is-visible');
        } else {
            tooltip.classList.remove('is-visible');
        }
    }

    canvas.addEventListener('pointerdown', (e) => {
        const pos = getCanvasPos(e);
        const hit = findNodeAt(pos.x, pos.y);
        if (hit) {
            activeNode = hit;
            activeNode.isDragging = true;
            pointerDownPos = { x: pos.x, y: pos.y };
            hasDragged = false;
            canvas.classList.add('is-dragging');
            canvas.setPointerCapture(e.pointerId);
            showTooltip(activeNode);
        }
    });

    canvas.addEventListener('pointermove', (e) => {
        const pos = getCanvasPos(e);
        if (activeNode) {
            const dist = Math.hypot(pos.x - pointerDownPos.x, pos.y - pointerDownPos.y);
            if (dist > 5) {
                hasDragged = true;
            }
            activeNode.x = Math.max(activeNode.radius, Math.min(width - activeNode.radius, pos.x));
            activeNode.y = Math.max(activeNode.radius, Math.min(height - activeNode.radius, pos.y));
            activeNode.vx = 0;
            activeNode.vy = 0;
            showTooltip(activeNode);
        } else {
            const hovered = findNodeAt(pos.x, pos.y);
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].isHovered = (nodes[i] === hovered);
            }
            if (hovered) {
                canvas.style.cursor = 'grab';
                showTooltip(hovered);
            } else {
                canvas.style.cursor = 'default';
                showTooltip(null);
            }
        }
    });

    function handlePointerRelease(e) {
        if (activeNode) {
            const clickedNode = activeNode;
            if (!hasDragged) {
                // Node was clicked or tapped: trigger relevant action
                if (clickedNode.url.startsWith('mailto:')) {
                    window.location.href = clickedNode.url;
                } else {
                    window.open(clickedNode.url, '_blank', 'noopener,noreferrer');
                }
            }

            clickedNode.isDragging = false;
            try {
                canvas.releasePointerCapture(e.pointerId);
            } catch (_) {}
            activeNode = null;
            canvas.classList.remove('is-dragging');
            showTooltip(null);
        }
    }

    canvas.addEventListener('pointerup', handlePointerRelease);
    canvas.addEventListener('pointercancel', handlePointerRelease);
    canvas.addEventListener('pointerleave', () => {
        if (!activeNode) {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].isHovered = false;
            }
            showTooltip(null);
        }
    });

    // Animation Loop
    function animationLoop() {
        updatePhysics();
        draw();
        if (activeNode && tooltip) {
            tooltip.style.left = activeNode.x + 'px';
            tooltip.style.top = (activeNode.y - activeNode.radius - 8) + 'px';
        }
        requestAnimationFrame(animationLoop);
    }

    requestAnimationFrame(animationLoop);
}