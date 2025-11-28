/**
 * MATRIX TEXT POLISH: CYBERPUNK DECODE EFFECT
 * 
 * Logic:
 * 1. Targets all `h1` elements.
 * 2. Scrambles text with random characters, preserving spaces.
 * 3. Decodes character by character to original text.
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const TARGET_SELECTOR = 'h1';
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const DECODE_SPEED = 50; // ms per frame
    const ITERATIONS_PER_CHAR = 3; // How many scrambles before fixing a char

    // --- INITIALIZATION ---
    function initMatrixText() {
        const headers = document.querySelectorAll(TARGET_SELECTOR);

        headers.forEach(header => {
            const originalText = header.innerText;
            if (!header.dataset.originalText) {
                header.dataset.originalText = originalText;
            }

            if (!header.classList.contains('matrix-text-holder')) {
                header.classList.add('matrix-text-holder');

                const placeholder = document.createElement('span');
                placeholder.className = 'matrix-text-placeholder';
                placeholder.textContent = originalText;
                placeholder.setAttribute('aria-hidden', 'true');

                const active = document.createElement('span');
                active.className = 'matrix-text-anim';
                active.textContent = originalText;

                header.textContent = '';
                header.appendChild(placeholder);
                header.appendChild(active);
            }

            const target = header.querySelector('.matrix-text-anim');
            if (target) {
                runDecodeEffect(target, originalText);
            }
        });
    }

    function runDecodeEffect(element, originalText) {
        const textLength = originalText.length;
        let iterations = 0;

        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    // Preserve spaces
                    if (char === ' ') return ' ';

                    // If we have passed enough iterations for this character, show the original
                    if (index < Math.floor(iterations)) {
                        return originalText[index];
                    }

                    // Otherwise show a random character
                    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                })
                .join('');

            // Stop when we've decoded the whole string
            if (iterations >= textLength) {
                clearInterval(interval);
                element.innerText = originalText; // Ensure final state is clean
            }

            // Increment iterations
            // We want to decode one character every ITERATIONS_PER_CHAR frames
            iterations += 1 / ITERATIONS_PER_CHAR;
        }, DECODE_SPEED);
    }

    // Run Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMatrixText);
    } else {
        initMatrixText();
    }

})();
