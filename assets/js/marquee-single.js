(function () {
    'use strict';

    const ASSET_PATH = 'assets/images/socialmedia/';
    const MARQUEE_IMAGES = [
        '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        '1-1_business_monitor-graphs_10k-lost-overnight.jpg',
        '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg',
        '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg',
        '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
        '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
        '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg',
        '2-3_ai_phone-processing_connect-automate-grow.jpg',
        '2-3_ai_smartphone-call-completed_automate-what-matters.jpg',
        '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg',
        '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg',
        '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg',
        '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg',
        '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
        '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
        '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg'
    ];

    function initSingleMarquee() {
        document.querySelectorAll('.single-marquee, .double-marquee').forEach(el => el.remove());

        ensureLightbox();

        const footer = document.querySelector('footer.site-footer');
        if (!footer || !footer.parentNode) return;

        const container = document.createElement('div');
        container.className = 'single-marquee';
        const row = createMarqueeRow(MARQUEE_IMAGES, 'scroll-left');
        container.appendChild(row);

        footer.parentNode.insertBefore(container, footer);
    }

    function createMarqueeRow(images, classes) {
        const track = document.createElement('div');
        track.className = `marquee-track ${classes}`;

        track.appendChild(createImagesFragment(images));
        track.appendChild(createImagesFragment(images));
        return track;
    }

    function createImagesFragment(images) {
        const fragment = document.createDocumentFragment();
        images.forEach(file => {
            const img = document.createElement('img');
            img.src = ASSET_PATH + file;
            img.className = 'marquee-img';
            img.alt = 'Silverstone Client Success';
            img.loading = 'lazy';
            img.onerror = () => { img.style.display = 'none'; };
            img.addEventListener('click', () => openLightbox(img.src));
            fragment.appendChild(img);
        });
        return fragment;
    }

    function ensureLightbox() {
        if (document.getElementById('premium-lightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'premium-lightbox';
        lightbox.className = 'premium-lightbox';

        const content = document.createElement('div');
        content.className = 'lightbox-content';

        const img = document.createElement('img');
        img.id = 'lightbox-img';
        img.className = 'lightbox-img';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.ariaLabel = 'Close Lightbox';
        closeBtn.addEventListener('click', closeLightbox);

        content.appendChild(img);
        content.appendChild(closeBtn);
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
    }

    function openLightbox(src) {
        const lightbox = document.getElementById('premium-lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lightbox || !img) return;
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('premium-lightbox');
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSingleMarquee);
    } else {
        initSingleMarquee();
    }
})();
