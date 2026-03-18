(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  const NICHE_MAP = {
    '/niches/estate-agents': {
      label: 'Estate agents',
      atlasAnchor: '/pricing#pricing-atlas-real-estate',
      primaryAnchor: '/pricing#pricing-flagship-never-miss-a-viewing',
      packName: 'Never Miss a Viewing Pack',
      nicheHref: '/niches/estate-agents',
      pricingLabel: 'Compare estate pricing',
    },
    '/niches/hospitality': {
      label: 'Hospitality',
      atlasAnchor: '/pricing#pricing-atlas-hospitality',
      primaryAnchor: '/pricing#pricing-flagship-24-7-guest-concierge',
      packName: '24/7 Guest Concierge Bot',
      nicheHref: '/niches/hospitality',
      pricingLabel: 'Compare hospitality pricing',
    },
    '/niches/salons-barbers': {
      label: 'Salons & barbers',
      atlasAnchor: '/pricing#pricing-atlas-salons',
      primaryAnchor: '/pricing#pricing-atlas-salons',
      packName: 'Rebook & Review Pack',
      nicheHref: '/niches/salons-barbers',
      pricingLabel: 'Compare salon pricing',
    },
    '/niches/trades-virtual-office': {
      label: 'Trades & field services',
      atlasAnchor: '/pricing#pricing-atlas-trades',
      primaryAnchor: '/pricing#pricing-flagship-trades-virtual-office',
      packName: 'Trades Virtual Office',
      nicheHref: '/niches/trades-virtual-office',
      pricingLabel: 'Compare trades pricing',
    },
    '/niches/ecommerce': {
      label: 'eCommerce',
      atlasAnchor: '/pricing#pricing-atlas-ecommerce',
      primaryAnchor: '/pricing#pricing-atlas-ecommerce',
      packName: 'E-com Growth Engine',
      nicheHref: '/niches/ecommerce',
      pricingLabel: 'Compare eCommerce pricing',
    },
    '/niches/physios-chiropractors': {
      label: 'Physios & chiropractors',
      atlasAnchor: '/pricing#pricing-atlas-physios-chiropractors',
      primaryAnchor: '/pricing#pricing-atlas-physios-chiropractors',
      packName: 'Smart Intake Starter Pack',
      nicheHref: '/niches/physios-chiropractors',
      pricingLabel: 'Compare clinic pricing',
    },
    '/niches/dentists': {
      label: 'Dentists',
      atlasAnchor: '/pricing#pricing-atlas-dentists',
      primaryAnchor: '/pricing#pricing-atlas-dentists',
      packName: 'Recall Starter Pack',
      nicheHref: '/niches/dentists',
      pricingLabel: 'Compare dental pricing',
    },
    '/niches/gyms-fitness-studios': {
      label: 'Gyms & fitness studios',
      atlasAnchor: '/pricing#pricing-atlas-gym-owners',
      primaryAnchor: '/pricing#pricing-atlas-gym-owners',
      packName: 'Gym Growth Engine',
      nicheHref: '/niches/gyms-fitness-studios',
      pricingLabel: 'Compare gym pricing',
    },
    '/niches/fitness-coaches': {
      label: 'Fitness coaches & creators',
      atlasAnchor: '/pricing#pricing-atlas-fitness-coaches',
      primaryAnchor: '/pricing#pricing-atlas-fitness-coaches',
      packName: 'DM to Lead Starter Pack',
      nicheHref: '/niches/fitness-coaches',
      pricingLabel: 'Compare creator pricing',
    },
  };

  const RECOMMENDER_ORDER = [
    '/niches/estate-agents',
    '/niches/hospitality',
    '/niches/salons-barbers',
    '/niches/trades-virtual-office',
    '/niches/ecommerce',
    '/niches/physios-chiropractors',
    '/niches/dentists',
    '/niches/gyms-fitness-studios',
    '/niches/fitness-coaches',
  ];

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    if (pathname === '/index.html') return '/';
    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '');
    }
    return pathname;
  }

  function resolveNicheConfig(pathname) {
    return NICHE_MAP[normalizePathname(pathname)] || null;
  }

  function resolveRecommenderHref(config, mode) {
    if (!config) return '/pricing#pricing-atlas';
    if (mode === 'atlas') return config.atlasAnchor;
    return config.primaryAnchor || config.atlasAnchor;
  }

  function ensureAnchorTarget(hash) {
    if (!hash || hash === '#pricing-atlas') return;

    let attempts = 0;

    const tryFocus = () => {
      const target = document.querySelector(hash);
      if (target) {
        if (typeof target.focus === 'function') {
          target.focus({ preventScroll: true });
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        window.setTimeout(tryFocus, 120);
      }
    };

    window.setTimeout(tryFocus, 120);
  }

  function injectNicheLinks() {
    const config = resolveNicheConfig(window.location.pathname);
    if (!config) return;

    const heroButtons = document.querySelector('.hero .cta-buttons');
    if (heroButtons && !heroButtons.querySelector('[data-pricing-atlas-link]')) {
      const atlasButton = document.createElement('a');
      atlasButton.href = config.atlasAnchor;
      atlasButton.className = 'btn btn-secondary';
      atlasButton.dataset.pricingAtlasLink = 'true';
      atlasButton.textContent = config.pricingLabel;
      heroButtons.appendChild(atlasButton);
    }

    const ctaLinks = document.querySelector('.cta-link-list');
    if (ctaLinks && !ctaLinks.querySelector('[data-pricing-atlas-chip]')) {
      const atlasChip = document.createElement('a');
      atlasChip.href = config.atlasAnchor;
      atlasChip.dataset.pricingAtlasChip = 'true';
      atlasChip.textContent = `See ${config.label.toLowerCase()} pricing`;
      ctaLinks.insertBefore(atlasChip, ctaLinks.children[1] || null);
    }
  }

  function mountRecommender() {
    const host = document.querySelector('[data-pricing-recommender]');
    if (!host) return;

    let selectedPath = RECOMMENDER_ORDER[0];
    let selectedMode = 'fast';

    const render = () => {
      const config = resolveNicheConfig(selectedPath);
      const primaryHref = resolveRecommenderHref(config, selectedMode);
      const primaryLabel =
        selectedMode === 'fast' ? `See ${config.packName}` : `See ${config.label} atlas`;
      const resultCopy =
        selectedMode === 'fast'
          ? `Start with ${config.packName} if you want the cleanest first route to ROI for ${config.label.toLowerCase()}.`
          : `Open the ${config.label.toLowerCase()} atlas card to compare the smaller fixes and bigger bundles in one view.`;

      host.innerHTML = `
        <div class="pricing-recommender">
          <div class="pricing-recommender__panel">
            <span class="pricing-recommender__eyebrow">Pricing recommender</span>
            <h3 class="pricing-recommender__title">Point me to the right pricing card.</h3>
            <p class="pricing-recommender__copy">Choose your niche, then decide whether you want the fastest starting pack or the wider pricing atlas.</p>
            <div class="pricing-recommender__step">
              <span class="pricing-recommender__step-label">1. Choose your niche</span>
              <div class="pricing-recommender__choices pricing-recommender__choices--niches">
                ${RECOMMENDER_ORDER.map((path) => {
                  const entry = resolveNicheConfig(path);
                  const active = path === selectedPath ? ' is-active' : '';
                  return `<button class="pricing-recommender__choice${active}" type="button" data-niche-path="${path}">${entry.label}</button>`;
                }).join('')}
              </div>
            </div>
            <div class="pricing-recommender__step">
              <span class="pricing-recommender__step-label">2. What are you trying to do first?</span>
              <div class="pricing-recommender__choices">
                <button class="pricing-recommender__choice${selectedMode === 'fast' ? ' is-active' : ''}" type="button" data-recommender-mode="fast">Fastest starting pack</button>
                <button class="pricing-recommender__choice${selectedMode === 'atlas' ? ' is-active' : ''}" type="button" data-recommender-mode="atlas">Smaller fix or full atlas</button>
              </div>
            </div>
            <div class="pricing-recommender__result">
              <div class="pricing-recommender__result-copy">
                <span class="pricing-recommender__result-label">Recommended next view</span>
                <strong>${config.packName}</strong>
                <p>${resultCopy}</p>
              </div>
              <div class="pricing-recommender__actions">
                <a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a>
                <a class="btn btn-secondary" href="${config.atlasAnchor}">Open pricing atlas</a>
              </div>
              <a class="pricing-recommender__support-link" href="${config.nicheHref}">Read the ${config.label.toLowerCase()} page</a>
            </div>
          </div>
        </div>
      `;

      host.querySelectorAll('[data-niche-path]').forEach((button) => {
        button.addEventListener('click', () => {
          selectedPath = button.getAttribute('data-niche-path') || selectedPath;
          render();
        });
      });

      host.querySelectorAll('[data-recommender-mode]').forEach((button) => {
        button.addEventListener('click', () => {
          selectedMode = button.getAttribute('data-recommender-mode') || selectedMode;
          render();
        });
      });
    };

    render();
  }

  function initPricingDeeplinks() {
    if (initialized) return;
    initialized = true;

    if (document.body.classList.contains('page-pricing')) {
      mountRecommender();
    }

    if (document.body.classList.contains('page-niche')) {
      injectNicheLinks();
    }

    ensureAnchorTarget(window.location.hash);
    window.addEventListener('hashchange', () => ensureAnchorTarget(window.location.hash));
    window.addEventListener('load', () => ensureAnchorTarget(window.location.hash));
  }

  window.Silverstone.initPricingDeeplinks = initPricingDeeplinks;
})();
