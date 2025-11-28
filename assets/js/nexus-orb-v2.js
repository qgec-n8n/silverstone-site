/**
 * NEURAL NEXUS ORB V2: ETHEREAL SINGULARITY
 * 
 * Logic:
 * 1. Clean Slate: Removes old Orb elements.
 * 2. Injects new Orb HTML structure (Orb, Bubble, Rail).
 * 3. Scroll Trigger: Visible ONLY in Body (IntersectionObserver).
 * 4. Rail Logic: Filters images (Square/Landscape ONLY), Random selection.
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const ASSET_PATH = 'assets/images/socialmedia/';
    const HERO_SELECTOR = '.hero, header'; // Elements that define the "Top" zone

    // Full Image Pool (Square and Landscape ONLY, Verified Filenames)
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
        { file: '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.jpg', type: 'landscape' }
    ];

    // --- INITIALIZATION ---
    function initNexusOrb() {
        // 1. Clean Slate
        const oldOrbs = document.querySelectorAll('.neural-nexus, #neural-nexus-dock, .nexus-orb-container');
        oldOrbs.forEach(el => el.remove());

        // 2. Inject New Orb
        injectOrb();

        // 3. Setup Scroll Observer
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
        bubble.textContent = 'Unlock Your Vision';

        // Image Rail
        const rail = document.createElement('div');
        rail.className = 'nexus-rail';

        // Populate Rail (3 Random Valid Images)
        const selectedImages = getRandomImages(3);
        selectedImages.forEach(data => {
            const img = document.createElement('img');
            img.src = ASSET_PATH + data.file;
            img.className = 'nexus-rail-img';
            img.alt = 'Insight';

            // Click -> Lightbox (Reuse global if available, else simple open)
            img.addEventListener('click', () => {
                const lightbox = document.getElementById('premium-lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                if (lightbox && lightboxImg) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            rail.appendChild(img);
        });

        // Append in specific order
        // CSS expects: .nexus-orb:hover ~ .nexus-rail
        // So Orb must be BEFORE Rail in DOM.
        container.appendChild(orb);
        container.appendChild(bubble);
        container.appendChild(rail);

        document.body.appendChild(container);

        // Orb Click -> Navigate to Innovation Gallery
        orb.addEventListener('click', () => {
            window.location.href = 'services.html#neural-grid';
        });
    }

    // --- SCROLL LOGIC ---
    function setupScrollObserver() {
        const container = document.getElementById('nexus-orb-container');
        const hero = document.querySelector('.hero') || document.querySelector('header');

        if (!container || !hero) return;

        const observerOptions = {
            root: null,
            threshold: 0,
            rootMargin: "-100px 0px 0px 0px" // Trigger slightly after hero leaves view
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If Hero is intersecting (visible), HIDE Orb.
                // If Hero is NOT intersecting (scrolled past), SHOW Orb.
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
    function getRandomImages(count) {
        const shuffled = ORB_IMAGES.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Run Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNexusOrb);
    } else {
        initNexusOrb();
    }

})();
