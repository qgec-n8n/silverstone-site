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

            // Capture layout hints so the scramble respects the original line wrapping
            const computed = getComputedStyle(header);
            if (!header.dataset.originalWhiteSpace) {
                header.dataset.originalWhiteSpace = computed.whiteSpace;
            }

            // If the heading currently sits on one line, lock it to a single line during the effect
            const lineHeight = parseFloat(computed.lineHeight);
            const isSingleLine = !isNaN(lineHeight)
                ? header.getBoundingClientRect().height <= lineHeight * 1.2
                : header.getClientRects().length === 1;

            header.dataset.lockSingleLine = isSingleLine ? 'true' : 'false';
            header.dataset.originalDisplay = header.dataset.originalDisplay || header.style.display || '';

            // Start Effect
            runDecodeEffect(header);
        });
    }

    function runDecodeEffect(element) {
        const originalText = element.dataset.originalText;
        const textLength = originalText.length;
        let iterations = 0;
        const lockSingleLine = element.dataset.lockSingleLine === 'true';
        const originalWhiteSpace = element.dataset.originalWhiteSpace || '';
        const originalDisplay = element.dataset.originalDisplay || '';

        if (lockSingleLine) {
            element.style.whiteSpace = 'nowrap';
            element.style.display = 'inline-block';
        }

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

                if (lockSingleLine) {
                    element.style.whiteSpace = originalWhiteSpace;
                    element.style.display = originalDisplay;
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
