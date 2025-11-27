/**
 * Matrix Text Polish
 * Cyberpunk "Character Decode" animation for H1
 */

document.addEventListener('DOMContentLoaded', () => {
    const h1s = document.querySelectorAll('h1');

    h1s.forEach(h1 => {
        const originalText = h1.textContent;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

        let iterations = 0;

        const interval = setInterval(() => {
            h1.textContent = originalText
                .split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3; // Speed control
        }, 30);
    });
});
