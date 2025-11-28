/**
 * DOUBLE MARQUEE: SERVICES PAGE ONLY
 *
 * Logic:
 * 1. Specific to Services Page.
 * 2. Injects Double-Deck Marquee (Two rows: Left/Right).
 * 3. Handles Click -> Lightbox (Cinematic).
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const ASSET_PATH = 'assets/images/socialmedia/';
    // Full Archive of Social Media Images
    const MARQUEE_IMAGES = [
        '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
        '1-1_business_monitor-graphs_10k-lost-overnight.jpg',
        '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg',
        '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg',
        '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
        '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
        '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg',
        '2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.jpg',
        '2-3_accounting_office-with-swirling-invoices_tax-season-calls-never-missed.jpg',
        '2-3_ai_phone-processing_connect-automate-grow.jpg',
        '2-3_ai_smartphone-call-completed_automate-what-matters.jpg',
        '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg',
        '2-3_auto_mechanic-with-phone_while-you-fix-cars.jpg',
        '2-3_automation_charts-scale_scale-your-output-with-ai.jpg',
        '2-3_charity_call-centre-triage_every-caller-feels-heard.jpg',
        '2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.jpg',
        '2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.jpg',
        '2-3_dental_black-phone-appointments_never-miss-toothache.jpg',
        '2-3_dental_phone-with-schedule_every-patient-call-answered.jpg',
        '2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.jpg',
        '2-3_gym_phone-trial-ring_ai-calls-every-new-lead.jpg',
        '2-3_healthcare_call-queue_end-the-8am-phone-chaos.jpg',
        '2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.jpg',
        '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg',
        '2-3_hospitality_holographic-receptionist_your-front-desk-always-open.jpg',
        '2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.jpg',
        '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg',
        '2-3_realestate_phone-map_never-miss-a-viewing.jpg',
        '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.jpg',
        '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg',
        '2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.jpg',
        '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg',
        '2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg',
        '2-3_veterinary_vet-with-tablet_never-miss-a-worried-pet-parent.jpg',
        '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.jpg',
        '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.jpg',
        '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
        '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg',
        '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.jpg',
        '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.jpg',
        '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
        '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg',
        '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg',
        '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg',
        '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.jpg'
    ];

    // --- INITIALIZATION ---
    function initDoubleMarquee() {
        // Ensure we don't duplicate
        if (document.querySelector('.premium-marquee-container.double-deck')) return;

        // Ensure Lightbox Exists (Global Injection)
        injectLightbox();

        injectDoubleDeckMarquee();
    }

    // --- INJECTION LOGIC ---
    function injectDoubleDeckMarquee() {
        // Target: Directly underneath Innovation Gallery and above CTA banner
        const ctaSection = document.querySelector('.section.brand-gradient');

        // If we can't find CTA, try to find the Innovation Gallery to append after
        const gallerySection = document.querySelector('.section.bg-circuit');

        let targetNode = ctaSection;
        let parentNode = ctaSection ? ctaSection.parentNode : document.body;

        // If we want it "part of the Innovation Gallery section", maybe append inside?
        // But user said "Directly underneath the Mosaic". The mosaic is inside .section.bg-circuit > .container > #neural-grid
        // The user request is: "ensure that the new Double Marquee files that injects exclusively into the services.html ensures that the bottom of the innovation gallery and top of the double marquee are almost touching."
        // We will insert BEFORE the CTA section, which is after the gallery section.

        if (!targetNode) {
            console.warn('CTA Section not found, appending to body');
            document.body.appendChild(createDoubleDeckContainer());
            return;
        }

        const container = createDoubleDeckContainer();
        parentNode.insertBefore(container, targetNode);
    }

    function createDoubleDeckContainer() {
        const container = document.createElement('div');
        container.className = 'premium-marquee-container double-deck';

        // Row 1: Top Row -> Move RIGHT FAST
        const row1 = createMarqueeRow(MARQUEE_IMAGES, 'scroll-right fast');

        // Row 2: Bottom Row -> Move LEFT SLOW
        const row2 = createMarqueeRow(MARQUEE_IMAGES.slice().reverse(), 'scroll-left slow');

        container.appendChild(row1);
        container.appendChild(row2);
        return container;
    }

    // --- ROW CREATION ---
    function createMarqueeRow(images, animationClasses) {
        const track = document.createElement('div');
        track.className = `marquee-track ${animationClasses}`;

        // Duplicate content to ensure seamless loop
        const content = createImagesFragment(images);
        const contentClone = createImagesFragment(images); // Clone for seamless loop

        track.appendChild(content);
        track.appendChild(contentClone);

        return track;
    }

    function createImagesFragment(images) {
        const fragment = document.createDocumentFragment();
        images.forEach(filename => {
            const img = document.createElement('img');
            img.src = ASSET_PATH + filename;
            img.className = 'marquee-img';
            img.alt = 'Silverstone Client Success';
            img.loading = 'lazy';

            // Error handling
            img.onerror = function () { this.style.display = 'none'; };

            // Click -> Lightbox
            img.addEventListener('click', () => openLightbox(img.src));

            fragment.appendChild(img);
        });
        return fragment;
    }

    // --- LIGHTBOX LOGIC ---
    function injectLightbox() {
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

        // Strict Closing Logic: ONLY the 'X' button closes it
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
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeLightbox() {
        const lightbox = document.getElementById('premium-lightbox');
        if (!lightbox) return;

        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    // Run Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDoubleMarquee);
    } else {
        initDoubleMarquee();
    }

})();
