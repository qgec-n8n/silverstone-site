/**
 * Global Cinematic Lightbox
 * Shared resource for Gallery and Marquees
 */

window.SilverstoneLightbox = (function () {
    let lightboxEl = null;
    let imgEl = null;
    let activeSourceImg = null;

    function init() {
        if (document.getElementById('silverstone-lightbox')) return;

        lightboxEl = document.createElement('div');
        lightboxEl.id = 'silverstone-lightbox';
        lightboxEl.className = 'lightbox-overlay';

        const content = document.createElement('div');
        content.className = 'lightbox-content';

        imgEl = document.createElement('img');
        imgEl.className = 'lightbox-image';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.ariaLabel = 'Close Lightbox';

        closeBtn.addEventListener('click', close);
        lightboxEl.addEventListener('click', (e) => {
            if (e.target === lightboxEl) close();
        });

        content.appendChild(imgEl);
        content.appendChild(closeBtn);
        lightboxEl.appendChild(content);
        document.body.appendChild(lightboxEl);
    }

    function open(src, alt, sourceElement) {
        if (!lightboxEl) init();

        activeSourceImg = sourceElement;
        imgEl.src = src;
        imgEl.alt = alt;

        lightboxEl.classList.add('active');

        // Cinematic Expansion Animation
        if (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            const scaleX = rect.width / window.innerWidth;
            const scaleY = rect.height / window.innerHeight;

            // Start from source position
            // This is a simplified FLIP animation approach
            // Ideally we'd calculate exact matrix, but for "Cinematic" feel, a center zoom is often cleaner
            // Let's try a scale-up from center with a slight blur removal

            contentAnimateIn();
        }
    }

    function close() {
        if (!lightboxEl) return;
        lightboxEl.classList.remove('active');
        setTimeout(() => {
            imgEl.src = '';
        }, 300);
    }

    function contentAnimateIn() {
        imgEl.style.transform = 'scale(0.8)';
        imgEl.style.opacity = '0';
        imgEl.style.filter = 'blur(10px)';

        requestAnimationFrame(() => {
            imgEl.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            imgEl.style.transform = 'scale(1)';
            imgEl.style.opacity = '1';
            imgEl.style.filter = 'blur(0)';
        });
    }

    return {
        open,
        close
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize on load
    // window.SilverstoneLightbox.init(); // Lazy init in open() is better
});
