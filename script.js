// ===== ACADEMICPAGES INTERACTIVITY & MOBILE SCRIPT =====
// For Albert Ankomah Dodoo Portfolio

document.addEventListener('DOMContentLoaded', () => {
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
});
