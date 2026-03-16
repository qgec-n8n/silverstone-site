(function () {
  'use strict';

  const ASSET_PATH = '/assets/images/socialmedia/';
  const LIGHTBOX_MOBILE_QUERY = '(max-width: 768px)';
  const MARQUEE_ROOT_MARGIN = '1200px 0px';
  const MARQUEE_IMAGES = [
  '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.webp',
  '2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.webp',
  '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.webp',
  'Dentists_1.webp',
  '1-1_business_monitor-graphs_10k-lost-overnight.webp',
  '2-3_accounting_office-with-swirling-invoices_tax-season-calls-never-missed.webp',
  '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.webp',
  'Dentists_2.webp',
  '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.webp',
  '2-3_ai_phone-processing_connect-automate-grow 2.webp',
  '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.webp',
  'Dentists_3.webp',
  '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.webp',
  '2-3_ai_phone-processing_connect-automate-grow.webp',
  '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep 2.webp',
  'eComm_1.webp',
  '1-1_marketing_boardroom-messages_your-prospects-can-tell.webp',
  '2-3_ai_smartphone-call-completed_automate-what-matters.webp',
  '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.webp',
  'eComm_2.webp',
  '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.webp',
  '2-3_analytics_dashboard_ai-clarity-for-human-performance.webp',
  '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.webp',
  'eComm_3.webp',
  '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.webp',
  '2-3_auto_mechanic-with-phone_while-you-fix-cars.webp',
  '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.webp',
  'General_Services_1.webp',
  '2-3_automation_charts-scale_scale-your-output-with-ai.webp',
  '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.webp',
  'General_Services_2A.webp',
  '2-3_charity_call-centre-triage_every-caller-feels-heard.webp',
  '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.webp',
  'General_Services_2B.webp',
  '2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.webp',
  '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.webp',
  'General_Services_3.webp',
  '2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.webp',
  '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.webp',
  'Gyms_1.webp',
  '2-3_dental_black-phone-appointments_never-miss-toothache.webp',
  'Gyms_2.webp',
  '2-3_dental_phone-with-schedule_every-patient-call-answered.webp',
  'Gyms_3.webp',
  '2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.webp',
  'Hospitality_1.webp',
  '2-3_gym_phone-trial-ring_ai-calls-every-new-lead.webp',
  'Hospitality_2.webp',
  '2-3_healthcare_call-queue_end-the-8am-phone-chaos.webp',
  'Hospitality_3.webp',
  '2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.webp',
  'Online_Coach_1.webp',
  '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.webp',
  'Online_Coach_2.webp',
  '2-3_hospitality_holographic-receptionist_your-front-desk-always-open.webp',
  'Online_Coach_3.webp',
  '2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.webp',
  'Physio_1.webp',
  '2-3_realestate_phone-map_never-miss-a-viewing.webp',
  'Physio_2.webp',
  '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.webp',
  'Physio_3.webp',
  '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.webp',
  'Real_Estate_1.webp',
  '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.webp',
  'Real_Estate_2.webp',
  '2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.webp',
  'Real_Estate_3.webp',
  '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.webp',
  'Salon_1.webp',
  '2-3_tradesman_van-at-night_never-miss-an-emergency-job.webp',
  'Salon_2.webp',
  '2-3_veterinary_vet-with-tablet_never-miss-a-worried-pet-parent.webp',
  'Salon_3.webp',
  '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.webp',
  'Trades_1.webp',
  'Trades_2.webp',
  'Trades_3.webp',
];

  let singleInitialized = false;
  let doubleInitialized = false;

  function initSingleMarquee() {
    if (singleInitialized) return;
    if (document.body.classList.contains('page-services')) return;

    cleanupLegacyMarquees();

    const footer = document.querySelector('footer.site-footer');
    observeWhenNearViewport(footer, () => {
      if (singleInitialized || !footer || !footer.parentNode) return;
      singleInitialized = true;
      ensureLightbox();

      const marquee = buildSingleRow();
      footer.parentNode.insertBefore(marquee, footer);
    });
  }

  function initDoubleMarquee() {
    if (!document.body.classList.contains('page-services')) return;
    if (doubleInitialized) return;

    cleanupLegacyMarquees();

    const slot = document.getElementById('innovation-marquee-slot');
    const galleryGrid = document.getElementById('neural-grid');
    if (!slot && !galleryGrid) return;

    const target = galleryGrid || slot;

    observeWhenNearViewport(target, () => {
      if (doubleInitialized) return;
      doubleInitialized = true;
      ensureLightbox();

      const container = buildDoubleDeck();
      const currentSlot = document.getElementById('innovation-marquee-slot');
      const currentGrid = document.getElementById('neural-grid');

      if (currentSlot) {
        currentSlot.replaceWith(container);
      } else if (currentGrid && currentGrid.parentNode) {
        currentGrid.insertAdjacentElement('afterend', container);
      }

      alignInnovationAnchor();
    });
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .single-marquee, .double-marquee').forEach((el) => el.remove());
  }

  function observeWhenNearViewport(target, callback) {
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        callback();
      },
      {
        rootMargin: MARQUEE_ROOT_MARGIN,
      },
    );

    observer.observe(target);
  }

  function buildSingleRow() {
    const container = document.createElement('div');
    container.className = 'single-marquee';

    const track = document.createElement('div');
    track.className = 'marquee-track';

    track.appendChild(createImagesFragment(MARQUEE_IMAGES));
    track.appendChild(createImagesFragment(MARQUEE_IMAGES));

    container.appendChild(track);
    return container;
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

    track.appendChild(createImagesFragment(images));
    track.appendChild(createImagesFragment(images));

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
      img.decoding = 'async';

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

  function resolveLightboxSrc(trigger) {
    if (!trigger) return '';

    const mobileSrc = trigger.dataset.lightboxMobileSrc;
    const desktopSrc = trigger.dataset.lightboxSrc;
    const isMobile = !!window.matchMedia && window.matchMedia(LIGHTBOX_MOBILE_QUERY).matches;

    if (isMobile && mobileSrc) return mobileSrc;
    if (desktopSrc) return desktopSrc;

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function alignInnovationAnchor() {
    const hash = window.location.hash;
    if (!hash || (hash !== '#innovation-gallery' && hash !== '#neural-grid')) return;

    const target = document.getElementById('innovation-gallery') || document.getElementById('neural-grid');
    if (!target) return;

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;

    window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: 'auto' });
    }, 120);
  }

  function bindServiceTileLightbox() {
    const triggers = document.querySelectorAll('.js-premium-lightbox');
    if (!triggers.length) return;

    ensureLightbox();

    triggers.forEach((trigger) => {
      if (trigger.dataset.ssLightboxBound === '1') return;
      trigger.dataset.ssLightboxBound = '1';

      trigger.addEventListener('click', () => {
        const src = resolveLightboxSrc(trigger);
        if (!src) return;
        openLightbox(src);
      });
    });
  } // SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12

  function init() {
    initSingleMarquee();
    initDoubleMarquee();
    bindServiceTileLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
