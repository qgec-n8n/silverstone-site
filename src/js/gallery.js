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
        { file: 'Dentists_1_Mobile.jpeg', type: 'portrait', title: 'Connect & Grow' },
        { file: 'Gyms_2_Mobile.jpeg', type: 'portrait', title: 'AI Clarity' },
        { file: 'Hospitality_3_Mobile.jpeg', type: 'portrait', title: 'Patient Care' },
        { file: 'Online_Coach_1_Mobile.jpeg', type: 'portrait', title: 'Never Miss Viewing' },

        // --- COLUMN 2 (2 Portraits + 3 Squares) ---
        { file: 'Physio_2_Mobile.jpeg', type: 'portrait', title: 'Qualified Leads' },
        { file: 'Real_Estate_3_Mobile.jpeg', type: 'portrait', title: 'Zero Interruptions' },
        { file: 'services_lead_followup_mobile.jpg', type: 'square', title: 'Scale Limits' },
        { file: 'services_consulting_mobile.jpg', type: 'square', title: 'Marketing Intel' },
        { file: 'services_data_integration_mobile.jpg', type: 'square', title: 'Recruitment' },

        // --- COLUMN 3 (2 Portraits + 3 Landscapes + 1 Square) ---
        { file: 'Salon_1_Mobile.jpeg', type: 'portrait', title: 'Zero Burnout' },
        { file: 'Trades_2_Mobile.jpeg', type: 'portrait', title: 'Emergency Job' },
        { file: 'services_data_integration.jpg', type: 'landscape', title: 'Instant Response' },
        { file: 'services_workflow_automation.jpg', type: 'landscape', title: 'Legal Workflows' },
        { file: 'services_consulting.jpg', type: 'landscape', title: 'Logistics' },
        { file: 'services_workflow_automation_mobile.jpg', type: 'square', title: 'Stop Losing Cases' }
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
