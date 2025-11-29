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

  function initDoubleMarquee() {
    // Safety: only run on Services page
    if (!document.body.classList.contains('page-services')) return;

    alignInnovationAnchor();
    cleanupLegacyMarquees();
    ensureLightbox();

    const container = buildDoubleDeck();
    const slot = document.getElementById('innovation-marquee-slot');
    const galleryGrid = document.getElementById('neural-grid');

    if (slot) {
      slot.replaceWith(container);
    } else if (galleryGrid && galleryGrid.parentNode) {
      galleryGrid.insertAdjacentElement('afterend', container);
    } else {
      document.body.appendChild(container);
    }

    alignInnovationAnchor();
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .double-marquee, .single-marquee').forEach((el) => el.remove());
  }

  function buildDoubleDeck() {
    const wrapper = document.createElement('div');
    wrapper.className = 'double-marquee';

    const topRow = createMarqueeRow(MARQUEE_IMAGES, 'scroll-right fast');
    const bottomRow = createMarqueeRow([...MARQUEE_IMAGES].reverse(), 'scroll-left slow');

    wrapper.appendChild(topRow);
    wrapper.appendChild(bottomRow);
    return wrapper;
  }

  function createMarqueeRow(images, animationClasses) {
    const track = document.createElement('div');
    track.className = `marquee-track ${animationClasses}`;

    const firstPass = createImagesFragment(images);
    const secondPass = createImagesFragment(images);

    track.appendChild(firstPass);
    track.appendChild(secondPass);

    return track;
  }

  function createImagesFragment(images) {
    const fragment = document.createDocumentFragment();

    images.forEach((filename) => {
      const img = document.createElement('img');
      img.src = ASSET_PATH + filename;
      img.className = 'marquee-img';
      img.alt = 'Silverstone Client Success';
      img.loading = 'lazy';

      img.onerror = () => {
        img.style.display = 'none';
      };

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

  function alignInnovationAnchor() {
    const hash = window.location.hash;
    if (!hash || (hash !== '#innovation-gallery' && hash !== '#neural-grid')) return;

    const target = document.getElementById('innovation-gallery') || document.getElementById('neural-grid');
    if (!target) return;

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'auto' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDoubleMarquee);
  } else {
    initDoubleMarquee();
  }
})();
