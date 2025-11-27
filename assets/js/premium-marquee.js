/**
 * Premium Marquees
 * Logic:
 *  - IF services.html -> Inject #services-marquee (Double Row)
 *  - ELSE -> Inject #global-marquee (Single Row)
 */

document.addEventListener('DOMContentLoaded', () => {
    const isServicesPage = window.location.pathname.includes('services.html');
    const body = document.body;

    // Image pool (reusing gallery images for consistency + others)
    const marqueeImages = [
        'assets/images/socialmedia/1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        'assets/images/socialmedia/2-3_ai_laptop-flowchart_stop-wasting-hours.jpg',
        'assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
        'assets/images/socialmedia/2-3_business_smartphone-with-message_ai-just-booked-your-next-client.jpg',
        'assets/images/socialmedia/1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
        'assets/images/socialmedia/3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
        'assets/images/socialmedia/2-3_salon_chair-with-holographic-calendar_stay-fully-booked.jpg',
        'assets/images/socialmedia/1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
        'assets/images/socialmedia/3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg',
        'assets/images/socialmedia/2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg',
        'assets/images/socialmedia/3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg',
        'assets/images/socialmedia/2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg'
    ];

    if (isServicesPage) {
        createDoubleMarquee(body, marqueeImages);
    } else {
        createGlobalMarquee(body, marqueeImages);
    }
});

function createDoubleMarquee(container, images) {
    const wrapper = document.createElement('div');
    wrapper.id = 'services-marquee';
    wrapper.className = 'premium-marquee-wrapper double-deck';

    // Row 1: Left Fast
    const row1 = createMarqueeRow(images, 'left', 'fast');
    // Row 2: Right Slow
    const row2 = createMarqueeRow(images.slice().reverse(), 'right', 'slow');

    wrapper.appendChild(row1);
    wrapper.appendChild(row2);

    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(wrapper, footer);
    } else {
        container.appendChild(wrapper);
    }
}

function createGlobalMarquee(container, images) {
    const wrapper = document.createElement('div');
    wrapper.id = 'global-marquee';
    wrapper.className = 'premium-marquee-wrapper single-deck';

    const row = createMarqueeRow(images, 'left', 'normal');
    wrapper.appendChild(row);

    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(wrapper, footer);
    } else {
        container.appendChild(wrapper);
    }
}

function createMarqueeRow(images, direction, speed) {
    const row = document.createElement('div');
    row.className = `marquee-row ${direction} ${speed}`;

    const track = document.createElement('div');
    track.className = 'marquee-track';

    // Duplicate images to create seamless loop (x4 for safety on wide screens)
    const loopImages = [...images, ...images, ...images, ...images];

    loopImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Silverstone AI';
        img.loading = 'lazy';

        // Lightbox Trigger
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (window.SilverstoneLightbox) {
                window.SilverstoneLightbox.open(src, 'Silverstone AI', img);
            }
        });

        track.appendChild(img);
    });

    row.appendChild(track);
    return row;
}
