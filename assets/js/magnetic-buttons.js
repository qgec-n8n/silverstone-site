/**
 * Magnetic Buttons - Micro-interaction
 * Adds a subtle magnetic pull effect to buttons on hover.
 */

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic strength
            const strength = 10;

            btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            // Add a transition for smooth return, but remove it on mouseenter so it feels responsive
            btn.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => {
                btn.style.transition = '';
            }, 300);
        });
    });
});
