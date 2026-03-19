(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;
  let activeHighlightedCard = null;

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
      primaryAnchor: '/pricing#pricing-flagship-rebook-review',
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
      primaryAnchor: '/pricing#pricing-flagship-ecom-growth-engine',
      packName: 'E-com Growth Engine',
      nicheHref: '/niches/ecommerce',
      pricingLabel: 'Compare eCommerce pricing',
    },
    '/niches/physios-chiropractors': {
      label: 'Physios & chiropractors',
      atlasAnchor: '/pricing#pricing-atlas-physios-chiropractors',
      primaryAnchor: '/pricing#pricing-flagship-smart-intake',
      packName: 'Smart Intake Starter Pack',
      nicheHref: '/niches/physios-chiropractors',
      pricingLabel: 'Compare clinic pricing',
    },
    '/niches/dentists': {
      label: 'Dentists',
      atlasAnchor: '/pricing#pricing-atlas-dentists',
      primaryAnchor: '/pricing#pricing-flagship-recall-starter',
      packName: 'Recall Starter Pack',
      nicheHref: '/niches/dentists',
      pricingLabel: 'Compare dental pricing',
    },
    '/niches/gyms-fitness-studios': {
      label: 'Gyms & fitness studios',
      atlasAnchor: '/pricing#pricing-atlas-gym-owners',
      primaryAnchor: '/pricing#pricing-flagship-gym-growth-engine',
      packName: 'Gym Growth Engine',
      nicheHref: '/niches/gyms-fitness-studios',
      pricingLabel: 'Compare gym pricing',
    },
    '/niches/fitness-coaches': {
      label: 'Fitness coaches & creators',
      atlasAnchor: '/pricing#pricing-atlas-fitness-coaches',
      primaryAnchor: '/pricing#pricing-flagship-dm-to-lead',
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

  function toHashHref(href) {
    if (!href) return '#pricing-atlas';
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex) : href;
  }

  function getHeaderOffset() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const cssOffset = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-safe-offset')
    );
    const safeOffset = Number.isFinite(cssOffset) ? cssOffset : 0;
    return Math.max(headerHeight, safeOffset);
  }

  function applyHighlight(target) {
    if (!target || !target.classList) return;
    if (activeHighlightedCard && activeHighlightedCard !== target) {
      activeHighlightedCard.classList.remove('is-highlighted');
    }
    document.querySelectorAll('.ss-pricing__card.is-highlighted').forEach((card) => {
      if (card !== target) {
        card.classList.remove('is-highlighted');
      }
    });
    target.classList.add('is-highlighted');
    activeHighlightedCard = target;
  }

  function dispatchPricingTarget(hash) {
    window.dispatchEvent(
      new window.CustomEvent('silverstone:pricing-target', {
        detail: { hash, reveal: true },
      })
    );
  }

  function scrollToAnchorTarget(target) {
    const stickyApi = window.Silverstone && window.Silverstone.stickyCta;
    if (stickyApi && typeof stickyApi.collapseTemporarilyForAnchorNavigation === 'function') {
      stickyApi.collapseTemporarilyForAnchorNavigation();
    }

    const topOffset = getHeaderOffset() + 20;
    const nextTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset);

    window.scrollTo({
      top: nextTop,
      behavior: 'smooth',
    });
  }

  function ensureAnchorTarget(hash) {
    if (!hash) return;

    dispatchPricingTarget(hash);

    let attempts = 0;

    const tryFocus = () => {
      const target = document.querySelector(hash);
      if (target) {
        if (typeof target.focus === 'function') {
          target.focus({ preventScroll: true });
        }
        const finalizeScroll = () => {
          scrollToAnchorTarget(target);
          if (target.classList && target.classList.contains('ss-pricing__card')) {
            applyHighlight(target);
          }
        };
        if (window.innerWidth <= 780) {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(finalizeScroll);
          });
        } else {
          finalizeScroll();
        }
        return;
      }

      attempts += 1;
      if (attempts < 28) {
        window.setTimeout(tryFocus, 100);
      }
    };

    window.setTimeout(tryFocus, 80);
  }

  function injectNicheLinks() {
    const config = resolveNicheConfig(window.location.pathname);
    if (!config) return;
    const isMobile = window.matchMedia('(max-width: 780px)').matches;

    const heroButtons = document.querySelector('.hero .cta-buttons');
    if (heroButtons) {
      const existingAtlasButton = heroButtons.querySelector('[data-pricing-atlas-link]');
      if (isMobile) {
        existingAtlasButton?.remove();
      } else if (!existingAtlasButton) {
        const atlasButton = document.createElement('a');
        atlasButton.href = config.atlasAnchor;
        atlasButton.className = 'btn btn-secondary';
        atlasButton.dataset.pricingAtlasLink = 'true';
        atlasButton.textContent = config.pricingLabel;
        heroButtons.appendChild(atlasButton);
      }
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
      if (!config) return;

      const fastMode = selectedMode === 'fast';
      const primaryHref = fastMode ? toHashHref(config.primaryAnchor) : toHashHref(config.atlasAnchor);
      const secondaryHref = fastMode ? toHashHref(config.atlasAnchor) : config.nicheHref;
      const primaryLabel = fastMode ? `See ${config.packName}` : `Open ${config.label} atlas`;
      const secondaryLabel = fastMode ? 'Open pricing atlas' : `Open ${config.label} page`;
      const recommendedLabel = fastMode ? config.packName : `${config.label} atlas`;
      const resultCopy = fastMode
        ? `Start with ${config.packName} if you want the fastest payback for ${config.label.toLowerCase()}.`
        : `Open the ${config.label.toLowerCase()} atlas to compare modules, starter packs, and premium builds in one view.`;

      host.innerHTML = `
        <div class="pricing-recommender">
          <div class="pricing-recommender__panel">
            <span class="pricing-recommender__eyebrow">Pricing recommender</span>
            <h3 class="pricing-recommender__title">Point me to the right pricing card.</h3>
            <p class="pricing-recommender__copy">Choose your niche, then pick the fastest starting pack or the full range.</p>
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
              <span class="pricing-recommender__step-label">2. What do you want to compare?</span>
              <div class="pricing-recommender__choices">
                <button class="pricing-recommender__choice${fastMode ? ' is-active' : ''}" type="button" data-recommender-mode="fast">Fastest starting pack</button>
                <button class="pricing-recommender__choice${!fastMode ? ' is-active' : ''}" type="button" data-recommender-mode="atlas">Compare every pack</button>
              </div>
            </div>
            <div class="pricing-recommender__result">
              <div class="pricing-recommender__result-copy">
                <span class="pricing-recommender__result-label">Best next view</span>
                <strong>${recommendedLabel}</strong>
                <p>${resultCopy}</p>
              </div>
              <div class="pricing-recommender__actions">
                <a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a>
                <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
              </div>
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
      document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#pricing-"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        event.preventDefault();
        if (window.location.hash !== href) {
          window.history.pushState(null, '', href);
        }
        ensureAnchorTarget(href);
      });
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
