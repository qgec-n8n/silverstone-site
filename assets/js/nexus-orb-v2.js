/**
 * Neural Nexus Orb v2
 * "Stealth Luxury" - Mid-Right Fixed
 * Hidden on Mobile (<768px)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Check
    if (window.innerWidth < 768) return;

    // Remove v1 if exists
    const oldOrb = document.querySelector('.neural-nexus-orb');
    if (oldOrb) oldOrb.remove();

    createNexusOrb();
});

function createNexusOrb() {
    const container = document.createElement('div');
    container.id = 'nexus-orb-v2';
    container.className = 'nexus-orb-container';

    // The Orb
    const orb = document.createElement('div');
    orb.className = 'nexus-orb';

    // Inner Pulse
    const core = document.createElement('div');
    core.className = 'nexus-core';
    orb.appendChild(core);

    // Image Rail (Hidden by default, expands on hover)
    const rail = document.createElement('div');
    rail.className = 'nexus-rail';

    // 3 Random Images for the rail
    const railImages = [
        'assets/images/socialmedia/1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        'assets/images/socialmedia/2-3_ai_laptop-flowchart_stop-wasting-hours.jpg',
        'assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg'
    ];

    railImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'nexus-rail-img';
        rail.appendChild(img);
    });

    container.appendChild(rail);
    container.appendChild(orb);
    document.body.appendChild(container);

    // Hover Interactions
    container.addEventListener('mouseenter', () => {
        container.classList.add('expanded');
    });

    container.addEventListener('mouseleave', () => {
        container.classList.remove('expanded');
    });
}
