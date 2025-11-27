/**
 * Premium Innovation Gallery
 * target: div#neural-grid on services.html
 */

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('neural-grid');
    if (!gridContainer) return;

    // Curated list of images (mixed aspect ratios)
    const galleryImages = [
        { src: 'assets/images/socialmedia/1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg', alt: 'Scale Beyond Limits', ratio: 'square' },
        { src: 'assets/images/socialmedia/2-3_ai_laptop-flowchart_stop-wasting-hours.jpg', alt: 'Stop Wasting Hours', ratio: 'portrait' },
        { src: 'assets/images/socialmedia/3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg', alt: 'Instant Response', ratio: 'landscape' },
        { src: 'assets/images/socialmedia/2-3_business_smartphone-with-message_ai-just-booked-your-next-client.jpg', alt: 'Auto Booking', ratio: 'portrait' },
        { src: 'assets/images/socialmedia/1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg', alt: 'Marketing Intel', ratio: 'square' },
        { src: 'assets/images/socialmedia/3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg', alt: 'Legal Workflows', ratio: 'landscape' },
        { src: 'assets/images/socialmedia/2-3_salon_chair-with-holographic-calendar_stay-fully-booked.jpg', alt: 'Fully Booked', ratio: 'portrait' },
        { src: 'assets/images/socialmedia/1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg', alt: 'Recruitment AI', ratio: 'square' },
        { src: 'assets/images/socialmedia/3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg', alt: 'Logistics Optimization', ratio: 'landscape' },
        { src: 'assets/images/socialmedia/2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg', alt: 'Data Clarity', ratio: 'portrait' },
        { src: 'assets/images/socialmedia/3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg', alt: 'Sales Conversion', ratio: 'landscape' },
        { src: 'assets/images/socialmedia/2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg', alt: 'Patient Care', ratio: 'portrait' },
        { src: 'assets/images/socialmedia/1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg', alt: 'Ecommerce Hub', ratio: 'square' },
        { src: 'assets/images/socialmedia/2-3_realestate_phone-map_never-miss-a-viewing.jpg', alt: 'Real Estate Viewing', ratio: 'portrait' }
    ];

    // Clear existing content
    gridContainer.innerHTML = '';

    galleryImages.forEach((imgData, index) => {
        const card = document.createElement('div');
        card.className = `neural-card ${imgData.ratio}`;
        card.style.animationDelay = `${index * 0.1}s`;

        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.loading = 'lazy';

        // Lightbox trigger
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            if (window.SilverstoneLightbox) {
                window.SilverstoneLightbox.open(img.src, imgData.alt, img);
            }
        });

        const overlay = document.createElement('div');
        overlay.className = 'neural-overlay';

        const info = document.createElement('div');
        info.className = 'neural-info';

        const title = document.createElement('h4');
        title.textContent = imgData.alt;

        info.appendChild(title);
        overlay.appendChild(info);
        card.appendChild(img);
        card.appendChild(overlay);

        // 3D Tilt Effect
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);

        gridContainer.appendChild(card);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
});
