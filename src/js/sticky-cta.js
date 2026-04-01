(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;
  let temporaryCollapseTimeoutId = null;

  const STORAGE_KEY = 'ss-cta-collapsed';
  const MOBILE_BREAKPOINT = 780;

  const NICHE_CTA_MAP = {
    '/services/estate-agents': {
      eyebrow: 'Estate agent pricing',
      title: 'Compare estate pricing or book the audit.',
      copy: 'Jump straight to the real-estate pricing atlas, then scope the right branch workflow.',
      secondaryHref: '/pricing#pricing-atlas-real-estate',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Estate pricing',
    },
    '/services/hospitality': {
      eyebrow: 'Hospitality pricing',
      title: 'Compare hospitality pricing or book the audit.',
      copy: 'Open the hospitality atlas card, then narrow down the guest-concierge or no-show fix.',
      secondaryHref: '/pricing#pricing-atlas-hospitality',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Hospitality pricing',
    },
    '/services/salons-barbers': {
      eyebrow: 'Salon pricing',
      title: 'Compare salon pricing or book the audit.',
      copy: 'See the salon atlas card first, then scope the no-show or rebooking system that fits.',
      secondaryHref: '/pricing#pricing-atlas-salons',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Salon pricing',
    },
    '/services/trades': {
      eyebrow: 'Trades pricing',
      title: 'Compare trades pricing or book the audit.',
      copy: 'Open the trades atlas card, then choose the fastest call, quote, or scheduling fix.',
      secondaryHref: '/pricing#pricing-atlas-trades',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Trades pricing',
    },
    '/services/ecommerce': {
      eyebrow: 'eCommerce pricing',
      title: 'Compare eCommerce pricing or book the audit.',
      copy: 'See the eCommerce atlas card before you choose a cart, support, or LTV workflow.',
      secondaryHref: '/pricing#pricing-atlas-ecommerce',
      secondaryLabel: 'See pricing',
      launcherLabel: 'eCommerce pricing',
    },
    '/services/physios-chiropractors': {
      eyebrow: 'Clinic pricing',
      title: 'Compare clinic pricing or book the audit.',
      copy: 'Open the clinic atlas card, then scope the intake or rebooking layer that pays back fastest.',
      secondaryHref: '/pricing#pricing-atlas-physios-chiropractors',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Clinic pricing',
    },
    '/services/dentists': {
      eyebrow: 'Dental pricing',
      title: 'Compare dental pricing or book the audit.',
      copy: 'See the dental atlas card first, then choose the recall or treatment follow-up route.',
      secondaryHref: '/pricing#pricing-atlas-dentists',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Dental pricing',
    },
    '/services/gyms-fitness-studios': {
      eyebrow: 'Gym pricing',
      title: 'Compare gym pricing or book the audit.',
      copy: 'Open the gym atlas card, then choose the member reactivation or class-fill system.',
      secondaryHref: '/pricing#pricing-atlas-gym-owners',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Gym pricing',
    },
    '/services/fitness-coaches': {
      eyebrow: 'Creator pricing',
      title: 'Compare creator pricing or book the audit.',
      copy: 'See the creator atlas card before choosing your DM triage or onboarding workflow.',
      secondaryHref: '/pricing#pricing-atlas-fitness-coaches',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Creator pricing',
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
        launcherLabel: 'Open pricing',
      };
    }

    if (normalizedPath === '/services') {
      return {
        eyebrow: 'Services to pricing',
        title: 'Compare packs or book the audit.',
        copy: 'Move from the services overview into the pricing atlas without losing your place.',
        secondaryHref: '/pricing#pricing-atlas',
        secondaryLabel: 'Compare pricing',
        launcherLabel: 'See pricing',
      };
    }

    if (normalizedPath === '/pricing') {
      return {
        eyebrow: 'Ready to scope',
        title: 'Book the audit when you know the pricing range.',
        copy: 'Use services if you need more context, then come back to pricing with a narrower shortlist.',
        secondaryHref: '/services',
        secondaryLabel: 'View services',
        launcherLabel: 'Open CTA',
      };
    }

    return NICHE_CTA_MAP[normalizedPath] || null;
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isHoverLauncherMode() {
    return (
      !isMobileViewport() &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

  function createStickyShell(config) {
    const shell = document.createElement('aside');
    shell.className = 'sticky-cta-shell';
    shell.setAttribute('aria-label', 'Sticky call to action');
    shell.innerHTML = `
      <div class="sticky-cta" aria-hidden="true">
        <button class="sticky-cta__close" type="button" aria-label="Minimise sticky call to action">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <span class="sticky-cta__eyebrow">${config.eyebrow}</span>
        <div class="sticky-cta__title">${config.title}</div>
        <p class="sticky-cta__copy">${config.copy}</p>
        <div class="sticky-cta__actions">
          <a class="btn btn-secondary" href="${config.secondaryHref}">${config.secondaryLabel}</a>
          <a class="btn btn-primary" href="/book">Book audit</a>
        </div>
      </div>
      <button class="sticky-cta__launcher" type="button" aria-label="${config.launcherLabel}">
        <span class="sticky-cta__launcher-icon" aria-hidden="true">
          <i class="fa-solid fa-bolt"></i>
        </span>
        <span class="sticky-cta__launcher-copy">${config.launcherLabel}</span>
      </button>
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

    const shell = createStickyShell(config);
    const sticky = shell.querySelector('.sticky-cta');
    const launcher = shell.querySelector('.sticky-cta__launcher');
    const closeButton = shell.querySelector('.sticky-cta__close');

    if (!sticky || !launcher || !closeButton) return;

    document.body.appendChild(shell);
    document.body.classList.add('has-sticky-cta');

    const cookieBanner = document.getElementById('cookie-banner');
    const state = {
      dismissed: window.sessionStorage.getItem(STORAGE_KEY) === '1',
      previewOpen: false,
      suppressPreview: false,
      temporarilyCollapsed: false,
      shouldShow: false,
    };

    function syncAria() {
      const expanded = state.shouldShow && (!state.dismissed || state.previewOpen);
      sticky.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      launcher.setAttribute(
        'aria-label',
        expanded ? 'Sticky call to action is open' : config.launcherLabel
      );
    }

    function persistDismissed(value) {
      if (value) {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    function render() {
      const expanded =
        state.shouldShow &&
        !state.temporarilyCollapsed &&
        (!state.dismissed || state.previewOpen);
      shell.classList.toggle('is-visible', state.shouldShow);
      shell.classList.toggle('is-dismissed', state.dismissed);
      shell.classList.toggle('is-preview-open', state.previewOpen);
      shell.classList.toggle('is-temp-collapsed', state.temporarilyCollapsed);
      shell.classList.toggle('is-mobile', isMobileViewport());
      sticky.classList.toggle('is-visible', expanded);
      launcher.classList.toggle('is-visible', state.shouldShow && !expanded);
      syncAria();
    }

    function setDismissed(nextValue, persist, options) {
      const shouldSuppressPreview =
        !!nextValue && !!options && options.suppressPreview && isHoverLauncherMode();
      state.dismissed = !!nextValue;
      state.previewOpen = false;
      state.suppressPreview = shouldSuppressPreview;
      state.temporarilyCollapsed = false;
      if (!nextValue) {
        state.suppressPreview = false;
      }
      if (persist !== false) {
        persistDismissed(state.dismissed);
      }
      render();
    }

    function openPreview(force) {
      if (!state.dismissed || !state.shouldShow || !isHoverLauncherMode()) return;
      if (state.suppressPreview && !force) return;
      state.previewOpen = true;
      render();
    }

    function closePreview() {
      if (!state.dismissed || !state.previewOpen || !isHoverLauncherMode()) return;
      state.previewOpen = false;
      render();
    }

    const updateBottomOffset = () => {
      const bannerVisible =
        cookieBanner &&
        window.getComputedStyle(cookieBanner).display !== 'none' &&
        cookieBanner.getBoundingClientRect().height > 0;
      const extraBottom = bannerVisible ? cookieBanner.getBoundingClientRect().height + 12 : 16;
      shell.style.bottom = `calc(${extraBottom}px + var(--safe-area-bottom))`;
    };

    const updateVisibility = () => {
      const heroRect = hero.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const passedHero = heroRect.bottom < window.innerHeight * 0.45;
      const footerOverlap = footerRect.top < window.innerHeight - 120;

      state.shouldShow = passedHero && !footerOverlap;
      shell.classList.toggle('is-hidden-by-footer', footerOverlap);
      if (!state.shouldShow) {
        state.previewOpen = false;
        state.temporarilyCollapsed = false;
      }
      updateBottomOffset();
      render();
    };

    closeButton.addEventListener('click', (event) => {
      setDismissed(true, true, { suppressPreview: true });
      if (!isHoverLauncherMode() || event.detail === 0) {
        launcher.focus({ preventScroll: true });
      }
    });

    launcher.addEventListener('click', () => {
      if (isHoverLauncherMode()) {
        openPreview();
        return;
      }
      state.temporarilyCollapsed = false;
      setDismissed(false, true);
    });

    launcher.addEventListener('mouseenter', openPreview);
    launcher.addEventListener('focus', () => {
      if (!state.suppressPreview) {
        openPreview(true);
      }
    });

    const collapseIfLeavingShell = (event) => {
      if (!shell.contains(event.relatedTarget)) {
        closePreview();
      }
    };

    launcher.addEventListener('mouseleave', collapseIfLeavingShell);
    sticky.addEventListener('mouseleave', collapseIfLeavingShell);
    launcher.addEventListener('mouseleave', () => {
      if (state.suppressPreview) {
        state.suppressPreview = false;
      }
    });
    shell.addEventListener('focusout', (event) => {
      if (!shell.contains(event.relatedTarget)) {
        state.suppressPreview = false;
        closePreview();
      }
    });

    sticky.addEventListener('mouseenter', openPreview);

    const api = {
      collapseTemporarilyForAnchorNavigation() {
        if (!state.shouldShow || isHoverLauncherMode()) return 0;
        state.previewOpen = false;
        state.temporarilyCollapsed = true;
        if (temporaryCollapseTimeoutId) {
          window.clearTimeout(temporaryCollapseTimeoutId);
        }
        temporaryCollapseTimeoutId = window.setTimeout(() => {
          state.temporarilyCollapsed = false;
          render();
        }, 1800);
        render();
        return launcher.getBoundingClientRect().height || 0;
      },
      isVisible() {
        return state.shouldShow;
      },
      isDismissed() {
        return state.dismissed;
      },
    };

    window.Silverstone.stickyCta = api;

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
  }

  window.Silverstone.initStickyCta = initStickyCta;
})();
