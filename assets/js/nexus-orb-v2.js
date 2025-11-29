// Nexus Orb V2.0 - Premium Integration
// Manages the floating orb, rail UI, and transitions to the Innovation Gallery

(function () {
  'use strict';

  function handleOrbNavigation(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    try {
      sessionStorage.setItem('silverstone_skip_hero_anim', 'true');
      sessionStorage.setItem('silverstone_orb_redirect', 'true');
    } catch (err) {
      // sessionStorage may be blocked; fail silently
    }

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasGSAP = !!(window.gsap && typeof window.gsap.to === 'function');

    const navigate = () => {
      window.location.href = 'services.html#neural-grid';
    };

    if (!hasGSAP || prefersReduced) {
      navigate();
      return;
    }

    // Animate the orb expanding into a "singularity"
    const orbElement = document.querySelector('.nexus-orb');
    if (!orbElement) {
      navigate();
      return;
    }

    gsap.to(orbElement, {
      scale: 40,
      duration: 0.8,
      ease: 'expo.in',
      onComplete: navigate
    });
  }

  // Configuration
  const CONFIG = {
    orbId: 'nexus-orb-container',
    scrollThreshold: 100, // Show orb after scrolling this many pixels
    railItems: [
      {
        src: 'assets/images/zip/Silverstone_25.jpg',
        type: 'portrait',
        alt: 'Automated Insight'
      },
      {
        src: 'assets/images/zip/Silverstone_22.jpg',
        type: 'square',
        alt: 'Human-AI Synergy'
      },
      {
        src: 'assets/images/zip/Silverstone_06.jpg',
        type: 'landscape',
        alt: 'Future Infrastructure'
      }
    ]
  };

  /**
   * Injects the Orb and Rail HTML into the document body.
   */
  function injectOrb() {
    // Avoid duplicate injection
    if (document.getElementById(CONFIG.orbId)) return;

    const container = document.createElement('div');
    container.id = CONFIG.orbId;

    // The glowing orb itself
    const orb = document.createElement('div');
    orb.className = 'nexus-orb';
    orb.setAttribute('aria-label', 'Open Innovation Gallery');
    orb.setAttribute('role', 'button');
    orb.setAttribute('tabindex', '0');
    // Add click handler
    orb.addEventListener('click', handleOrbNavigation);

    // The text bubble
    const bubble = document.createElement('div');
    bubble.className = 'nexus-bubble';
    bubble.textContent = 'View Innovation Gallery';

    // The rail (holds the thumbnails)
    const rail = document.createElement('div');
    rail.className = 'nexus-rail';

    // Populate rail images
    CONFIG.railItems.forEach(item => {
      const img = document.createElement('img');
      img.src = item.src;
      img.className = 'nexus-rail-img';
      img.classList.add(`type-${item.type}`);
      img.alt = item.alt;
      img.loading = 'lazy';
      // Add click handler
      img.addEventListener('click', handleOrbNavigation);
      rail.appendChild(img);
    });

    // Assemble structure
    container.appendChild(rail);
    container.appendChild(bubble);
    container.appendChild(orb);

    document.body.appendChild(container);

    // Initialise interaction logic
    initOrbInteractions(container, orb, bubble, rail);
  }

  /**
   * Sets up hover, click and scroll interactions.
   */
  function initOrbInteractions(container, orb, bubble, rail) {
    let isHovered = false;

    // Show/Hide based on scroll position
    function handleScroll() {
      const scrollY = window.scrollY;
      if (scrollY > CONFIG.scrollThreshold) {
        container.classList.add('visible');
      } else {
        container.classList.remove('visible');
      }
    }

    // Hover effects: expand rail, show bubble
    orb.addEventListener('mouseenter', () => {
      isHovered = true;
      container.classList.add('expanded');
    });

    container.addEventListener('mouseleave', () => {
      isHovered = false;
      container.classList.remove('expanded');
    });

    // Keyboard accessibility for Orb
    orb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOrbNavigation(e);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
  }

  // Boot the orb when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectOrb);
  } else {
    injectOrb();
  }

})();
