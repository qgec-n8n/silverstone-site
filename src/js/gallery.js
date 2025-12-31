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
        // SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30
        // SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30
        // --- COLUMN 1 (4 Portraits) ---
        { file: 'General_Services_2B_Mobile.jpeg', type: 'portrait', title: 'Automation Modules', backCopy: 'Expanded modules across your systems.' },
        { file: 'eComm_3_Mobile.jpeg', type: 'portrait', title: 'eCommerce Momentum', backCopy: 'Keep orders, carts, and follow-ups moving.' },
        { file: 'Trades_2_Mobile.jpeg', type: 'portrait', title: 'Trades Dispatch', backCopy: 'Route jobs fast with clean, live updates.' },
        { file: 'Gyms_1_Mobile.jpeg', type: 'portrait', title: 'Gym Member Flow', backCopy: 'Lead-to-member journeys handled smoothly.' },

        // --- COLUMN 2 (2 Portraits + 3 Squares) ---
        { file: 'Hospitality_1_Mobile.jpeg', type: 'portrait', title: 'Hospitality Flow', backCopy: 'Bookings, reminders, and guest comms aligned.' },
        { file: '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.webp', type: 'portrait', title: 'Viewing Focus', backCopy: 'Prioritise viewings with instant responses.' },
        { file: 'services_consulting_mobile.jpg', type: 'square', title: 'Consulting Sprint', backCopy: 'Clarity on tools, roadmap, and next steps.' },
        { file: 'services_data_integration_mobile.jpg', type: 'square', title: 'Data Integration', backCopy: 'Connect apps so data flows cleanly.' },
        { file: 'services_workflow_automation_mobile.jpg', type: 'square', title: 'Workflow Automation', backCopy: 'Remove bottlenecks with smart workflows.' },

        // --- COLUMN 3 (2 Portraits + 3 Landscapes + 1 Square) ---
        { file: '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.webp', type: 'portrait', title: 'Voicebot Coverage', backCopy: 'Always-on conversations without burnout.' },
        { file: '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.webp', type: 'portrait', title: 'Salon Bookings', backCopy: 'Confirmed bookings with fewer gaps.' },
        { file: '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.webp', type: 'landscape', title: 'Focused Tutoring', backCopy: '1:1 sessions stay organised and on time.' },
        { file: '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.webp', type: 'landscape', title: 'Sales Dashboards', backCopy: 'Track calls, replies, and conversion lift.' },
        { file: '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.webp', type: 'landscape', title: 'Always-On Sales', backCopy: 'Sales keep moving after hours.' },
        { file: '1-1_Trades_Grid.jpg', type: 'square', title: 'Trades Grid', backCopy: 'Jobs, updates, and schedules in one grid.' }
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
        img.loading = 'eager';
        img.decoding = 'async';
        img.fetchPriority = 'high';

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
        subtitle.textContent = data.backCopy || 'Click to expand';
        back.appendChild(title);
        back.appendChild(subtitle);

        inner.appendChild(front);
        inner.appendChild(back);
        tile.appendChild(inner);

        // Click Event -> Open Lightbox
        tile.addEventListener('click', () => openLightbox(img.src));

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
