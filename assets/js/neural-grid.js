/**
 * Neural Grid - Cinematic Efficiency
 * Handles grid layout based on filename aspect ratios, glitch reveal, and 3D tilt.
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('neural-grid');
    if (!grid) return;

    // 1. Auto-Assign Grid Spans based on Filename
    const cards = grid.querySelectorAll('.neural-card');

    cards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;

        const src = img.getAttribute('src');
        const filename = src.split('/').pop();

        // Check for aspect ratio prefixes
        if (filename.startsWith('2-3')) {
            card.classList.add('span-row-2');
        } else if (filename.startsWith('3-2')) {
            card.classList.add('span-col-2');
        }
        // 1-1 is default, no class needed
    });

    // 2. Glitch-Decode Entrance Observer
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

    // 3. 3D Tilt Effect
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
});
