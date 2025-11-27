/**
 * Neural Grid - Cinematic Efficiency
 * Handles grid layout based on filename aspect ratios, glitch reveal, 3D tilt, and Holographic Lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('neural-grid');
    if (!grid) return;

    // --- 1. Auto-Assign Grid Spans & Aspect Ratio Logic ---
    const cards = grid.querySelectorAll('.neural-card');

    cards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;

        const src = img.getAttribute('src');
        const filename = src.split('/').pop();

        // Check for aspect ratio prefixes
        if (filename.startsWith('2-3')) {
            card.classList.add('span-row-2');
            // Vertical image in vertical slot -> cover is fine
        } else if (filename.startsWith('3-2')) {
            card.classList.add('span-col-2');
            // Horizontal image in horizontal slot -> cover is fine
        } else {
            // 1-1 or unknown. If it's a 1-1 slot but image is wildly different, we might want contain.
            // For now, we assume 1-1 images for 1-1 slots.
        }

        // Click to open Lightbox
        card.addEventListener('click', () => openLightbox(src));
    });

    // --- 2. Glitch-Decode Entrance Observer ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const card = entry.target;

                // Staggered delay
                setTimeout(() => {
                    card.classList.add('revealed');
                    card.classList.add('glitching');

                    // Remove glitch class after animation
                    setTimeout(() => {
                        card.classList.remove('glitching');
                    }, 600);

                }, index * 100); // 100ms stagger

                observer.unobserve(card);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- 3. 3D Tilt Effect ---
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    // --- 4. Holographic Lightbox ---
    // Create Lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-content">
            <img src="" alt="Full View" class="lightbox-image">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        setTimeout(() => {
            lightboxImg.src = '';
        }, 400); // Clear after fade out
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
