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
    // Removed wide characters like @, #, %, W, M to prevent line jumping
    const CHARACTERS = 'ABCDEFGHIJKLNPQRSTUVXYZ0123456789';
    const DECODE_SPEED = 50; // ms per frame
    const ITERATIONS_PER_CHAR = 3; // How many scrambles before fixing a char

    // --- INITIALIZATION ---
    function initMatrixText() {
        // Disable the effect on mobile devices to avoid costly animations
        if (window.matchMedia('(max-width: 768px)').matches) return;

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

        // Keep layout stable as characters shuffle
        restoreStyles = {
            display: element.style.display,
            width: element.style.width,
            height: element.style.height,
            whiteSpace: element.style.whiteSpace,
            verticalAlign: element.style.verticalAlign,
            overflow: element.style.overflow
        };

        // Lock dimensions to prevent layout shifts
        element.style.display = 'inline-block';
        // Add a tiny buffer to width to prevent aggressive wrapping on edge cases,
        // but keep overflow hidden to chop excess.
        element.style.width = `${Math.ceil(rect.width)}px`;
        element.style.height = `${Math.ceil(rect.height)}px`;
        element.style.verticalAlign = 'top';
        element.style.overflow = 'hidden';

        // Only enforce nowrap if it was originally single line to prevent wrapping changes
        if (lineCount <= 1) {
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
                    element.style.width = restoreStyles.width;
                    element.style.height = restoreStyles.height;
                    element.style.whiteSpace = restoreStyles.whiteSpace;
                    element.style.verticalAlign = restoreStyles.verticalAlign;
                    element.style.overflow = restoreStyles.overflow;
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
