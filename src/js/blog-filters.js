(function () {
  'use strict';

  const CATEGORY_ORDER = [
    'general',
    'estate-agents',
    'hospitality',
    'salons',
    'trades',
    'ecommerce',
    'physios',
    'dentists',
    'gyms',
    'fitness-coaches',
  ];

  const CATEGORY_LABELS = {
    all: 'All',
    general: 'General',
    'estate-agents': 'Estate Agents',
    hospitality: 'Hospitality',
    salons: 'Salons & Barbers',
    trades: 'Trades & Field Services',
    ecommerce: 'eCommerce Brands',
    physios: 'Physios & Chiropractors',
    dentists: 'Dentists',
    gyms: 'Gyms & Fitness Studios',
    'fitness-coaches': 'Fitness Coaches',
  };

  const BLOG_TAXONOMY = {
    '/blog/ai-appointment-reminders-uk-2026': 'general',
    '/blog/ai-automation-failures-uk-smes-2026': 'general',
    '/blog/ai-automation-uk-gdpr-2026-sme-guide': 'general',
    '/blog/ai-booking-automation-uk-hospitality-2026': 'hospitality',
    '/blog/ai-document-automation-uk-smes-2026': 'general',
    '/blog/ai-etas-smart-scheduling-uk-trades-2026': 'trades',
    '/blog/ai-lead-capture-trades-uk-2026': 'trades',
    '/blog/ai-lead-capture-uk-trades-2026': 'trades',
    '/blog/ai-lead-qualification-estate-agents-2026': 'estate-agents',
    '/blog/ai-no-show-reduction-uk-salons-barbers': 'salons',
    '/blog/ai-receptionist-small-business-2026': 'general',
    '/blog/ai-receptionist-uk-costs-roi-2026': 'general',
    '/blog/ai-voice-agents-uk-smes-2026': 'general',
    '/blog/ai-website-tools-uk-small-businesses-2026': 'general',
    '/blog/dental-recall-automation-uk-2026': 'dentists',
    '/blog/dm-to-client-automation-uk-fitness-coaches-2026': 'fitness-coaches',
    '/blog/gym-booking-automation-uk-gyms-studios-2026': 'gyms',
    '/blog/how-small-physio-and-chiro-clinics-can-cut-missed-sessions-and-improve-treatment-completion-with-simple-ai-automations': 'physios',
    '/blog/how-small-uk-estate-agents-can-use-automated-viewing-confirmations-to-cut-no-shows-and-win-instructions': 'estate-agents',
    '/blog/how-uk-dental-practices-can-automate-patient-intake-and-e-consent-to-cut-admin-speed-treatment-starts-and': 'dentists',
    '/blog/how-uk-dental-practices-can-use-ai-missed-call-recovery-to-fill-more-high-value-appointments': 'dentists',
    '/blog/how-uk-ecommerce-brands-can-use-ai-returns-triage-to-cut-support-load-and-keep-customers-happy': 'ecommerce',
    '/blog/how-uk-fitness-coaches-can-use-ai-lead-scoring-to-spend-less-time-in-dms-and-more-time-closing-the-right': 'fitness-coaches',
    '/blog/how-uk-gyms-and-fitness-studios-can-use-ai-win-back-journeys-to-reactivate-inactive-members': 'gyms',
    '/blog/how-uk-hotels-and-b-and-bs-can-install-a-24-7-ai-guest-concierge-a-90-day-checklist-costs-and-data-risk': 'hospitality',
    '/blog/how-uk-physio-and-chiropractic-clinics-can-automate-rebooking-to-keep-patients-on-plan': 'physios',
    '/blog/how-uk-salons-and-barbers-can-use-ai-rebooking-journeys-to-fill-gaps-between-appointments': 'salons',
    '/blog/how-uk-trades-businesses-can-use-ai-call-answering-to-stop-after-hours-emergency-jobs-going-to-competitors': 'trades',
    '/blog/post-purchase-automation-uk-ecommerce-repeat-customers': 'ecommerce',
    '/blog/quote-chase-automation-uk-trades-accepted-jobs-2026': 'trades',
    '/blog/quote-follow-up-automation-uk-trades-2026': 'trades',
  };

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    return pathname.replace(/\.html$/, '');
  }

  function normalizeBlogPath(href) {
    if (!href) return '';
    try {
      const url = new window.URL(href, window.location.origin);
      return normalizePathname(url.pathname);
    } catch (error) {
      return '';
    }
  }

  function getCategoryForHref(href) {
    return BLOG_TAXONOMY[normalizeBlogPath(href)] || 'general';
  }

  function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || CATEGORY_LABELS.general;
  }

  function createFilterShell(options) {
    const shell = document.createElement('div');
    shell.className = options.shellClassName || 'taxonomy-filter-shell';

    const filter = document.createElement('div');
    filter.className = 'taxonomy-filter';

    const header = document.createElement('div');
    header.className = 'taxonomy-filter__header';

    const label = document.createElement('span');
    label.className = 'taxonomy-filter__label';
    label.textContent = options.label;

    const status = document.createElement('span');
    status.className = 'taxonomy-filter__status';
    status.setAttribute('aria-live', 'polite');

    header.append(label, status);

    const chips = document.createElement('div');
    chips.className = 'taxonomy-filter__chips';

    filter.append(header, chips);
    shell.append(filter);

    return { shell, status, chips };
  }

  function createChip(category, onSelect) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'taxonomy-filter__chip';
    button.dataset.taxonomyChip = category;
    button.textContent = getCategoryLabel(category);
    button.addEventListener('click', () => onSelect(category));
    return button;
  }

  function updateChipState(chips, activeCategory) {
    chips.forEach((chip) => {
      const isActive = chip.dataset.taxonomyChip === activeCategory;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setupServicesGuideFilters() {
    const section = document.querySelector('#service-supporting-guides');
    const list = section && section.querySelector('.services-resource-list--blogs');
    if (!list) return;

    const allItems = Array.from(list.querySelectorAll('li'));
    const guideItems = allItems.filter((item) => !item.classList.contains('services-resource-item--view-all'));
    const viewAllItem = list.querySelector('.services-resource-item--view-all');
    const desktopQuery = window.matchMedia('(min-width: 769px)');

    guideItems.forEach((item) => {
      const link = item.querySelector('a');
      item.dataset.taxonomyCategory = getCategoryForHref(link && link.getAttribute('href'));
    });

    const { shell, status, chips } = createFilterShell({
      label: 'Guide categories',
      shellClassName: 'taxonomy-filter-shell taxonomy-filter-shell--services',
    });

    const chipElements = CATEGORY_ORDER.map((category) => createChip(category, applyCategory));
    chipElements.forEach((chip) => chips.appendChild(chip));
    list.parentNode.insertBefore(shell, list);

    function applyCategory(category) {
      if (!desktopQuery.matches) {
        shell.hidden = true;
        guideItems.forEach((item) => {
          item.hidden = false;
        });
        if (viewAllItem) {
          viewAllItem.hidden = false;
        }
        return;
      }

      shell.hidden = false;
      let visibleCount = 0;
      guideItems.forEach((item) => {
        const shouldShow = item.dataset.taxonomyCategory === category;
        item.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      if (viewAllItem) {
        viewAllItem.hidden = false;
      }
      status.textContent = `Showing ${visibleCount} ${getCategoryLabel(category)} guides`;
      updateChipState(chipElements, category);
    }

    const syncForViewport = () => applyCategory('general');
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', syncForViewport);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(syncForViewport);
    }
    applyCategory('general');
  }

  function setupBlogIndexFilters() {
    const body = document.body;
    if (!body || !body.classList.contains('page-blog') || body.classList.contains('page-blog-article')) {
      return;
    }

    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    if (!cards.length) return;

    cards.forEach((card) => {
      const link = card.querySelector('.blog-card__title a, .blog-card__media');
      card.dataset.taxonomyCategory = getCategoryForHref(link && link.getAttribute('href'));
    });

    const { shell, status, chips } = createFilterShell({
      label: 'Filter guides',
      shellClassName: 'neon-card taxonomy-filter-shell taxonomy-filter-shell--blog',
    });

    const chipElements = ['all'].concat(CATEGORY_ORDER).map((category) => createChip(category, applyCategory));
    chipElements.forEach((chip) => chips.appendChild(chip));
    grid.parentNode.insertBefore(shell, grid);

    function applyCategory(category) {
      let visibleCount = 0;
      cards.forEach((card) => {
        const shouldShow = category === 'all' || card.dataset.taxonomyCategory === category;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      status.textContent =
        category === 'all'
          ? `Showing all ${visibleCount} guides`
          : `Showing ${visibleCount} ${getCategoryLabel(category)} guides`;
      updateChipState(chipElements, category);
    }

    applyCategory('all');
  }

  function init() {
    setupServicesGuideFilters();
    setupBlogIndexFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
