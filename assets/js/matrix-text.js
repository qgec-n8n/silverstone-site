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
        const textLength = originalText.length;
        const computed = window.getComputedStyle(element);
        const lineHeight = parseFloat(computed.lineHeight) || 1;
        const rect = element.getBoundingClientRect();
        const lineCount = Math.round(rect.height / lineHeight) || 1;
        let restoreStyles = null;

        // Keep single-line headings from shifting as characters shuffle
        if (lineCount <= 1) {
            restoreStyles = {
                display: element.style.display,
                minWidth: element.style.minWidth,
                minHeight: element.style.minHeight,
                whiteSpace: element.style.whiteSpace
            };

            element.style.display = 'inline-block';
            element.style.minWidth = `${rect.width}px`;
            element.style.minHeight = `${rect.height}px`;
            element.style.whiteSpace = 'nowrap';
        }
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

                if (restoreStyles) {
                    element.style.display = restoreStyles.display;
                    element.style.minWidth = restoreStyles.minWidth;
                    element.style.minHeight = restoreStyles.minHeight;
                    element.style.whiteSpace = restoreStyles.whiteSpace;
                }
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
