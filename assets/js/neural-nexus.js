/**
 * Neural Nexus - Cross-Page Discovery
 * Injects a floating dock to drive traffic to the Services gallery.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Prevent double injection
    if (document.getElementById('neural-nexus')) return;

    // Create Container
    const container = document.createElement('div');
    container.id = 'neural-nexus';
    container.className = 'neural-nexus-container';

    // Random images for preview
    const images = [
        'assets/images/socialmedia/1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        'assets/images/socialmedia/2-3_ai_laptop-flowchart_stop-wasting-hours.jpg',
        'assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg'
    ];

    container.innerHTML = `
        <div class="nexus-orb" onclick="window.location.href='services.html#neural-grid'"></div>
        <div class="nexus-rail">
            ${images.map(src => `
                <div class="nexus-preview">
                    <img src="${src}" alt="Preview">
                </div>
            `).join('')}
        </div>
        <div class="nexus-tooltip">Explore Neural Grid</div>
    `;

    document.body.appendChild(container);

    // Inject CSS if not present (though we will link it in HTML for performance)
    if (!document.querySelector('link[href*="neural-nexus.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/css/neural-nexus.css';
        document.head.appendChild(link);
    }
});
