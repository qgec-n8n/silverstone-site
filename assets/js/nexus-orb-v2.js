/**
 * NEURAL NEXUS ORB V2: ETHEREAL SINGULARITY
 * 
 * Logic:
 * 1. Clean Slate: Removes old Orb elements.
 * 2. Injects new Orb HTML structure (Orb, Bubble, Rail).
 * 3. Scroll Trigger: Visible ONLY in Body (IntersectionObserver).
 * 4. Rail Logic: Filters images by Aspect Ratio, Random selection of ONE type.
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const ASSET_PATH = 'assets/images/socialmedia/';

    // Full Image Pool (Square and Landscape ONLY, Verified Filenames)
    // NOTE: Added 'type' property to facilitate grouping.
    const ORB_IMAGES = [
        // SQUARES
        { file: '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg', type: 'square' },
        { file: '1-1_business_monitor-graphs_10k-lost-overnight.jpg', type: 'square' },
        { file: '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg', type: 'square' },
        { file: '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg', type: 'square' },
        { file: '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg', type: 'square' },
        { file: '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg', type: 'square' },
        { file: '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg', type: 'square' },

        // LANDSCAPES
        { file: '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.jpg', type: 'landscape' },
        { file: '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg', type: 'landscape' },
        { file: '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg', type: 'landscape' },
        { file: '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.jpg', type: 'landscape' },
        { file: '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.jpg', type: 'landscape' },
        { file: '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg', type: 'landscape' },
        { file: '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg', type: 'landscape' },
        { file: '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg', type: 'landscape' },
        { file: '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg', type: 'landscape' },
        { file: '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.jpg', type: 'landscape' },

        // PORTRAITS (Added to pool to allow "random 2:3" option)
        { file: '2-3_ai_phone-processing_connect-automate-grow.jpg', type: 'portrait' },
        { file: '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg', type: 'portrait' },
        { file: '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg', type: 'portrait' },
        { file: '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg', type: 'portrait' },
        { file: '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg', type: 'portrait' }
    ];

    // --- INITIALIZATION ---
    function initNexusOrb() {
        const oldOrbs = document.querySelectorAll('.neural-nexus, #neural-nexus-dock, .nexus-orb-container');
        oldOrbs.forEach(el => el.remove());

        injectOrb();
        setupScrollObserver();
    }

    // --- INJECTION ---
    function injectOrb() {
        const container = document.createElement('div');
        container.id = 'nexus-orb-container';

        // Orb
        const orb = document.createElement('div');
        orb.className = 'nexus-orb';

        // Thought Bubble
        const bubble = document.createElement('div');
        bubble.className = 'nexus-bubble';
        bubble.textContent = 'View Innovation Gallery';

        // Image Rail
        const rail = document.createElement('div');
        rail.className = 'nexus-rail';

        // Populate Rail (3 Random Valid Images of SAME TYPE)
        const selectedImages = getUniformRandomImages(3);
        selectedImages.forEach(data => {
            const img = document.createElement('img');
            img.src = ASSET_PATH + data.file;
            img.className = 'nexus-rail-img';
            img.alt = 'Insight';

            // Add aspect ratio class
            img.classList.add(data.type);

            // UPDATED: Click -> Navigate to Innovation Gallery
            img.addEventListener('click', () => {
                sessionStorage.setItem('skipCineDown', '1');
                navigateToInnovationGallery();
            });

            rail.appendChild(img);
        });

        // DOM Order: Orb before Rail for CSS ~ selector
        container.appendChild(orb);
        container.appendChild(bubble);
        container.appendChild(rail);

        document.body.appendChild(container);

        orb.addEventListener('click', () => {
            sessionStorage.setItem('skipCineDown', '1');
            navigateToInnovationGallery();
        });
    }

    function navigateToInnovationGallery() {
        const targetId = 'neural-grid';
        const targetUrl = 'services.html#' + targetId;

        if (window.location.pathname.includes('services')) {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + targetId);
                return;
            }
        }

        window.location.href = targetUrl;
    }

    // --- SCROLL LOGIC ---
    function setupScrollObserver() {
        const container = document.getElementById('nexus-orb-container');
        const hero = document.querySelector('.hero') || document.querySelector('header');

        if (!container || !hero) return;

        const observerOptions = {
            root: null,
            threshold: 0,
            rootMargin: "-100px 0px 0px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.classList.remove('visible');
                } else {
                    container.classList.add('visible');
                }
            });
        }, observerOptions);

        observer.observe(hero);
    }

    // --- UTILS ---
    function getUniformRandomImages(count) {
        // 1. Group images by type
        const groups = ORB_IMAGES.reduce((acc, img) => {
            if (!acc[img.type]) acc[img.type] = [];
            acc[img.type].push(img);
            return acc;
        }, {});

        // 2. Pick a random type that has at least 'count' images
        const validTypes = Object.keys(groups).filter(type => groups[type].length >= count);

        if (validTypes.length === 0) return []; // Fallback

        const randomType = validTypes[Math.floor(Math.random() * validTypes.length)];
        const candidates = groups[randomType];

        // 3. Shuffle and pick 'count' images
        const shuffled = candidates.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNexusOrb);
    } else {
        initNexusOrb();
    }

})();
