/**
 * MATRIX TEXT POLISH: CYBERPUNK DECODE EFFECT
 * 
 * Logic:
 * 1. Targets all `h1` elements.
 * 2. Scrambles text with random characters.
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
            // Store original text
            if (!header.dataset.originalText) {
                header.dataset.originalText = header.innerText;
            }

            // Start Effect
            runDecodeEffect(header);
        });
    }

    function runDecodeEffect(element) {
        const originalText = element.dataset.originalText;
        let iterations = 0;

        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

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
