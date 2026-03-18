(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  const NICHE_CTA_MAP = {
    '/niches/estate-agents': {
      eyebrow: 'Estate agent pricing',
      title: 'Compare estate pricing or book the audit.',
      copy: 'Jump straight to the real-estate pricing atlas, then scope the right branch workflow.',
      secondaryHref: '/pricing#pricing-atlas-real-estate',
      secondaryLabel: 'See pricing',
    },
    '/niches/hospitality': {
      eyebrow: 'Hospitality pricing',
      title: 'Compare hospitality pricing or book the audit.',
      copy: 'Open the hospitality atlas card, then narrow down the guest-concierge or no-show fix.',
      secondaryHref: '/pricing#pricing-atlas-hospitality',
      secondaryLabel: 'See pricing',
    },
    '/niches/salons-barbers': {
      eyebrow: 'Salon pricing',
      title: 'Compare salon pricing or book the audit.',
      copy: 'See the salon atlas card first, then scope the no-show or rebooking system that fits.',
      secondaryHref: '/pricing#pricing-atlas-salons',
      secondaryLabel: 'See pricing',
    },
    '/niches/trades-virtual-office': {
      eyebrow: 'Trades pricing',
      title: 'Compare trades pricing or book the audit.',
      copy: 'Open the trades atlas card, then choose the fastest call, quote, or scheduling fix.',
      secondaryHref: '/pricing#pricing-atlas-trades',
      secondaryLabel: 'See pricing',
    },
    '/niches/ecommerce': {
      eyebrow: 'eCommerce pricing',
      title: 'Compare eCommerce pricing or book the audit.',
      copy: 'See the eCommerce atlas card before you choose a cart, support, or LTV workflow.',
      secondaryHref: '/pricing#pricing-atlas-ecommerce',
      secondaryLabel: 'See pricing',
    },
    '/niches/physios-chiropractors': {
      eyebrow: 'Clinic pricing',
      title: 'Compare clinic pricing or book the audit.',
      copy: 'Open the clinic atlas card, then scope the intake or rebooking layer that pays back fastest.',
      secondaryHref: '/pricing#pricing-atlas-physios-chiropractors',
      secondaryLabel: 'See pricing',
    },
    '/niches/dentists': {
      eyebrow: 'Dental pricing',
      title: 'Compare dental pricing or book the audit.',
      copy: 'See the dental atlas card first, then choose the recall or treatment follow-up route.',
      secondaryHref: '/pricing#pricing-atlas-dentists',
      secondaryLabel: 'See pricing',
    },
    '/niches/gyms-fitness-studios': {
      eyebrow: 'Gym pricing',
      title: 'Compare gym pricing or book the audit.',
      copy: 'Open the gym atlas card, then choose the member reactivation or class-fill system.',
      secondaryHref: '/pricing#pricing-atlas-gym-owners',
      secondaryLabel: 'See pricing',
    },
    '/niches/fitness-coaches': {
      eyebrow: 'Creator pricing',
      title: 'Compare creator pricing or book the audit.',
      copy: 'See the creator atlas card before choosing your DM triage or onboarding workflow.',
      secondaryHref: '/pricing#pricing-atlas-fitness-coaches',
      secondaryLabel: 'See pricing',
    },
  };

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    if (pathname === '/index.html') return '/';
    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '');
    }
    return pathname;
  }

  function resolveConfig(pathname) {
    const normalizedPath = normalizePathname(pathname);

    if (normalizedPath === '/') {
      return {
        eyebrow: 'Next step',
        title: 'See pricing or book the audit.',
        copy: 'Compare packs first if you are still deciding, or book the audit if you want a scoped recommendation.',
        secondaryHref: '/pricing',
        secondaryLabel: 'See pricing',
      };
    }

    if (normalizedPath === '/services') {
      return {
        eyebrow: 'Services to pricing',
        title: 'Compare packs or book the audit.',
        copy: 'Move from the services overview into the pricing atlas without losing your place.',
        secondaryHref: '/pricing#pricing-atlas',
        secondaryLabel: 'Compare pricing',
      };
    }

    if (normalizedPath === '/pricing') {
      return {
        eyebrow: 'Ready to scope',
        title: 'Book the audit when you know the pricing range.',
        copy: 'Use services if you need more context, then come back to pricing with a narrower shortlist.',
        secondaryHref: '/services',
        secondaryLabel: 'View services',
      };
    }

    return NICHE_CTA_MAP[normalizedPath] || null;
  }

  function createStickyCta(config) {
    const shell = document.createElement('div');
    shell.className = 'sticky-cta';
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = `
      <span class="sticky-cta__eyebrow">${config.eyebrow}</span>
      <div class="sticky-cta__title">${config.title}</div>
      <p class="sticky-cta__copy">${config.copy}</p>
      <div class="sticky-cta__actions">
        <a class="btn btn-secondary" href="${config.secondaryHref}">${config.secondaryLabel}</a>
        <a class="btn btn-primary" href="/book">Book audit</a>
      </div>
    `;
    return shell;
  }

  function initStickyCta() {
    if (initialized) return;
    initialized = true;

    const config = resolveConfig(window.location.pathname);
    if (!config) return;

    const footer = document.querySelector('.site-footer');
    const hero = document.querySelector('.hero');
    if (!footer || !hero) return;

    const sticky = createStickyCta(config);
    document.body.appendChild(sticky);
    document.body.classList.add('has-sticky-cta');

    const cookieBanner = document.getElementById('cookie-banner');

    const updateBottomOffset = () => {
      const bannerVisible =
        cookieBanner &&
        window.getComputedStyle(cookieBanner).display !== 'none' &&
        cookieBanner.getBoundingClientRect().height > 0;
      const extraBottom = bannerVisible ? cookieBanner.getBoundingClientRect().height + 12 : 16;
      sticky.style.bottom = `calc(${extraBottom}px + var(--safe-area-bottom))`;
    };

    const updateVisibility = () => {
      const heroRect = hero.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const passedHero = heroRect.bottom < window.innerHeight * 0.45;
      const footerOverlap = footerRect.top < window.innerHeight - 120;

      sticky.classList.toggle('is-visible', passedHero && !footerOverlap);
      sticky.classList.toggle('is-hidden-by-footer', footerOverlap);
      sticky.setAttribute('aria-hidden', passedHero && !footerOverlap ? 'false' : 'true');
      updateBottomOffset();
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
  }

  window.Silverstone.initStickyCta = initStickyCta;
})();
