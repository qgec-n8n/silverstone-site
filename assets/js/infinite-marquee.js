/**
 * Infinite Marquee - Cinematic Flow
 * Injects a scrolling marquee of images.
 */

document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'assets/images/socialmedia/1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        'assets/images/socialmedia/1-1_business_monitor-graphs_10k-lost-overnight.jpg',
        'assets/images/socialmedia/1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg',
        'assets/images/socialmedia/1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg',
        'assets/images/socialmedia/1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
        'assets/images/socialmedia/1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
        'assets/images/socialmedia/1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg',
        'assets/images/socialmedia/2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.jpg',
        'assets/images/socialmedia/2-3_ai_laptop-flowchart_stop-wasting-hours.jpg',
        'assets/images/socialmedia/2-3_business_smartphone-with-message_ai-just-booked-your-next-client.jpg',
        'assets/images/socialmedia/2-3_dental_phone-with-teeth-icons_never-miss-another-toothache.jpg',
        'assets/images/socialmedia/2-3_salon_chair-with-holographic-calendar_stay-fully-booked.jpg',
        'assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
        'assets/images/socialmedia/3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
        'assets/images/socialmedia/3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg'
    ];

    // Determine Page Context
    const isServicesPage = window.location.pathname.includes('services.html');

    // 1. Services Page Injection (Main Marquee)
    if (isServicesPage) {
        const gallerySection = document.querySelector('.section.brand-gradient'); // The section AFTER the gallery
        // Actually, user asked for "immediately after #innovation-gallery closing div".
        // The #innovation-gallery is inside a section. Let's find the section containing #neural-grid.
        const gridSection = document.getElementById('neural-grid')?.closest('section');

        if (gridSection) {
            const marqueeSection = createMarquee(images, false);
            gridSection.insertAdjacentElement('afterend', marqueeSection);
        }
    }

    // 2. Global Footer Injection (Slim Marquee)
    // Append to body just before footer, or insert before footer
    const footer = document.querySelector('footer.site-footer');
    if (footer) {
        // Check if we already injected a main marquee right above (don't double up on services page if it ends up next to footer)
        // On Services page, the brand-gradient section is between gallery and footer.
        // So we CAN add the slim marquee too, or skip it. 
        // User request: "Global Integration (Other Pages): Append Slim... Services Page: Insert new section".
        // Implies Slim is for "Other Pages".

        if (!isServicesPage) {
            const slimMarquee = createMarquee(images, true);
            footer.parentNode.insertBefore(slimMarquee, footer);
        }
    }

    function createMarquee(imgList, isSlim) {
        const section = document.createElement('div');
        section.className = `infinite-marquee-section ${isSlim ? 'slim-marquee' : ''}`;

        const track = document.createElement('div');
        track.className = 'marquee-track';

        // Duplicate images to create seamless loop
        // We need enough width to fill screen + buffer. 
        // Let's triple the list to be safe.
        const fullList = [...imgList, ...imgList, ...imgList];

        fullList.forEach(src => {
            const item = document.createElement('div');
            item.className = 'marquee-item';
            item.innerHTML = `<img src="${src}" alt="Gallery Item" loading="lazy">`;
            track.appendChild(item);
        });

        section.appendChild(track);
        return section;
    }
});
