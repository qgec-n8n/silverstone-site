/**
 * PREMIUM GALLERY: PRECISION-GAP MOSAIC & CINEMATIC LIGHTBOX
 * 
 * Logic:
 * 1. Clears existing #neural-grid content.
 * 2. Injects curated subset of images (15 images selected for perfect 3-column balance).
 * 3. Applies masonry-like classes (landscape/portrait/square).
 * 4. Handles 3D Flip on hover.
 * 5. Handles Lightbox open/close (Strict 'X' button close).
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const GALLERY_TARGET_ID = 'neural-grid';
    const ASSET_PATH = 'assets/images/socialmedia/';

    // Curated Image List
    // Strategy: 3 Columns. Target Height = 6.0 units.
    // Heights: Square=1.0, Portrait=1.5, Landscape=0.666(approx) -> 3 Landscapes = 2.0
    // Col 1: 4 Portraits (6.0)
    // Col 2: 2 Portraits + 3 Squares (6.0)
    // Col 3: 2 Portraits + 3 Landscapes + 1 Square (6.0)
    // Total: 8 Portraits, 4 Squares, 3 Landscapes = 15 Images.

    const CURATED_IMAGES = [
        // --- COLUMN 1 (4 Portraits) ---
        { file: '2-3_ai_phone-processing_connect-automate-grow.jpg', type: 'portrait', title: 'Connect & Grow' },
        { file: '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg', type: 'portrait', title: 'AI Clarity' },
        { file: '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg', type: 'portrait', title: 'Patient Care' },
        { file: '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg', type: 'portrait', title: 'Never Miss Viewing' },

        // --- COLUMN 2 (2 Portraits + 3 Squares) ---
        { file: '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg', type: 'portrait', title: 'Qualified Leads' },
        { file: '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg', type: 'portrait', title: 'Zero Interruptions' },
        { file: '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg', type: 'square', title: 'Scale Limits' },
        { file: '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg', type: 'square', title: 'Marketing Intel' },
        { file: '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg', type: 'square', title: 'Recruitment' },

        // --- COLUMN 3 (2 Portraits + 3 Landscapes + 1 Square) ---
        { file: '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.jpg', type: 'portrait', title: 'Zero Burnout' },
        { file: '2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg', type: 'portrait', title: 'Emergency Job' },
        { file: '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg', type: 'landscape', title: 'Instant Response' },
        { file: '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg', type: 'landscape', title: 'Legal Workflows' },
        { file: '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg', type: 'landscape', title: 'Logistics' },
        { file: '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg', type: 'square', title: 'Stop Losing Cases' }
    ];

    // --- INITIALIZATION ---
    function initPremiumGallery() {
        const gridContainer = document.getElementById(GALLERY_TARGET_ID);
        if (!gridContainer) return; // Not on services page or container missing

        // 1. Clean Slate Protocol
        gridContainer.innerHTML = '';
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }

        // 2. Build Mosaic
        const fragment = document.createDocumentFragment();

        CURATED_IMAGES.forEach(imgData => {
            const tile = createTile(imgData);
            fragment.appendChild(tile);
        });

        gridContainer.appendChild(fragment);

        // 3. Inject Lightbox DOM
        injectLightbox();
    }

    // --- TILE CREATION ---
    function createTile(data) {
        const tile = document.createElement('div');
        tile.className = `premium-tile ${data.type}`;

        // Inner Container for 3D Flip
        const inner = document.createElement('div');
        inner.className = 'tile-inner';

        // Front Face (Image)
        const front = document.createElement('div');
        front.className = 'tile-front';
        const img = document.createElement('img');
        img.src = ASSET_PATH + data.file;
        img.alt = data.title;
        img.loading = 'lazy';

        // Error handling
        img.onerror = function () {
            this.style.display = 'none';
            console.warn(`Image not found: ${data.file}`);
        };
        front.appendChild(img);

        // Back Face (Metadata)
        const back = document.createElement('div');
        back.className = 'tile-back';
        const title = document.createElement('h4');
        title.textContent = data.title;
        const subtitle = document.createElement('p');
        subtitle.textContent = 'View Detail';
        back.appendChild(title);
        back.appendChild(subtitle);

        inner.appendChild(front);
        inner.appendChild(back);
        tile.appendChild(inner);

        // Click Event -> Open Lightbox
        tile.addEventListener('click', () => openLightbox(img.src));

        tile.addEventListener('mouseenter', () => {
            tile.classList.add('animate__animated', 'animate__pulse');
        });

        tile.addEventListener('animationend', () => {
            tile.classList.remove('animate__animated', 'animate__pulse');
        });

        return tile;
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
        document.addEventListener('DOMContentLoaded', initPremiumGallery);
    } else {
        initPremiumGallery();
    }

})();
