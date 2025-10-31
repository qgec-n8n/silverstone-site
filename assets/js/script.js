/*
      Silverstone site JavaScript (restored parallax)

      This version reinstates the original cinematic parallax behaviour
      captured in the provided v25 script while preserving the
      responsiveness and scaling improvements made previously.  The hero
      section scales and darkens as the user begins to scroll, and the
      subsequent section fades and slides into view.  An easing
      auto‑scroll transitions the viewport over 2.5 seconds.  The header
      hides when scrolling down and reappears when scrolling up.  Mobile
      navigation toggling and fade‑in animations for elements marked with
      `.animate` are also included.

      The script dynamically injects `assets/css/custom.css` if it is not
      already present.  Ensure that custom.css merges the scaling
      overrides (service rows and gallery grid) with any parallax styling
      defined in earlier versions.
    */

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced‑motion settings. Rather than exiting the script
  // entirely, treat the page like a mobile layout so core interactions
  // (navigation toggles, cookie banner, etc.) continue to work while the
  // cinematic parallax behaviour remains disabled.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Determine the current pathname.  We no longer skip parallax on
  // privacy policy pages so that the hero and second section animate
  // consistently across the site.
  const pathname = window.location.pathname;

  // Inject custom.css if it hasn't been loaded yet.  This keeps HTML
  // files clean and allows CSS overrides to apply universally.  After
  // injecting custom.css we also load mobile-fixes.css to override any
  // rules that conflict on small screens.  Both stylesheets are only
  // added once per page.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly regardless of which page is open (e.g. about.html, services.html).
    // Prefixing with "./" makes the path relative to the site root when pages live at the root.
    link.href = './assets/css/custom.css';
    document.head.appendChild(link);
  }
  // Always append the mobile fixes stylesheet after custom.css so its
  // rules override earlier declarations.  Only inject if not already
  // present to avoid duplicate links.
  if (!document.querySelector('link[href*="assets/css/mobile-fixes.css"]')) {
    const fixesLink = document.createElement('link');
    fixesLink.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly on all pages.  Prefixing with "./" avoids resolving
    // inside nested directories (if any) and consistently points to the root assets folder.
    fixesLink.href = './assets/css/mobile-fixes.css';
    document.head.appendChild(fixesLink);
  }

  // Determine if the current viewport is considered "mobile".
  // On small screens we disable the cinematic parallax behaviour entirely
  // and allow the page to scroll normally.  The threshold of 900px aligns
  // with the breakpoints used in the CSS.
  //
  // Safari continues to exhibit scroll lock issues after the parallax
  // animation, even in the latest releases.  To preserve a smooth
  // experience we disable the cinematic parallax entirely for all
  // Safari versions.  This effectively treats Safari like a mobile
  // device: normal scrolling is used and no automatic transitions are
  // triggered.  For other browsers the parallax remains enabled unless
  // the viewport width is below the mobile threshold (900px).
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const disableParallax = isSafari || prefersReducedMotion;
  const isMobile = window.innerWidth <= 900 || disableParallax;

  const hero = document.querySelector('.hero');
  // Find the first <section> after the hero.  Some pages insert
  // <style> tags or other elements between sections, so skip over
  // anything that isn’t a section.
  let nextSection = null;
  if (hero) {
    let node = hero.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'section') {
        nextSection = node;
        break;
      }
      node = node.nextElementSibling;
    }
  }
  const header = document.querySelector('header');
  const hasHeroStructure = Boolean(hero && nextSection && header);

  if (hasHeroStructure) {
    // Initialize cinematic overlay elements for premium scroll effect
    if (!isMobile) {
      // Create cinematic overlay container
      const cinematicOverlay = document.createElement('div');
      cinematicOverlay.className = 'cinematic-overlay';
      hero.appendChild(cinematicOverlay);
      hero.cinematicOverlay = cinematicOverlay;

      // Create iris/aperture effect element
      const irisOverlay = document.createElement('div');
      irisOverlay.className = 'cinematic-iris';
      cinematicOverlay.appendChild(irisOverlay);
      hero.irisOverlay = irisOverlay;

      // Create light beams effect
      const lightBeams = document.createElement('div');
      lightBeams.className = 'cinematic-light-beams';
      cinematicOverlay.appendChild(lightBeams);
      hero.lightBeams = lightBeams;

      // Create film grain overlay
      const filmGrain = document.createElement('div');
      filmGrain.className = 'cinematic-film-grain';
      cinematicOverlay.appendChild(filmGrain);
      hero.filmGrain = filmGrain;

      // Create vignette effect
      const vignette = document.createElement('div');
      vignette.className = 'cinematic-vignette';
      cinematicOverlay.appendChild(vignette);
      hero.vignette = vignette;

      // Create particle canvas
      const particlesCanvas = document.createElement('canvas');
      particlesCanvas.className = 'cinematic-particles';
      cinematicOverlay.appendChild(particlesCanvas);
      hero.particlesCanvas = particlesCanvas;
      hero.particlesCtx = particlesCanvas.getContext('2d');

      // Initialize particle system
      initParticles();

      // Handle window resize for canvas
      window.addEventListener('resize', () => {
        if (hero.particlesCanvas) {
          hero.particlesCanvas.width = window.innerWidth;
          hero.particlesCanvas.height = window.innerHeight;
          initParticles();
        }
      });
    }

    // Initialise the next section so it starts hidden and lower on the page.
    // Only apply the fade/slide animations when the parallax is active.
    if (!isMobile) {
      nextSection.style.opacity = '0';
      nextSection.style.transform = 'translateY(80px)';
      nextSection.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
    }

    // On the contact or privacy pages ensure the first service row fills the viewport.
    // This applies regardless of the parallax state.
    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    // Quadratic easing for the auto‑scroll animation.
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Scroll state machine to prevent over-scrolling
    const ScrollState = {
      HERO: 'HERO',
      TRANSITIONING_DOWN: 'TRANSITIONING_DOWN',
      BODY: 'BODY',
      TRANSITIONING_UP: 'TRANSITIONING_UP'
    };
    let currentScrollState = ScrollState.HERO;
    let autoScrolling = false;

    /**
     * Smoothly scroll the document to the given Y position with enhanced
     * cinematic effects. Manages scroll state to prevent over-scrolling.
     *
     * @param {number} targetY The vertical pixel coordinate to scroll to.
     * @param {number} duration Duration of the animation in milliseconds.
     * @param {string} direction 'down' or 'up' for transition direction.
     */
    function animateScrollTo(targetY, duration, direction = 'down') {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      let startTime;
      autoScrolling = true;

      // Update state machine
      if (direction === 'down') {
        currentScrollState = ScrollState.TRANSITIONING_DOWN;
      } else {
        currentScrollState = ScrollState.TRANSITIONING_UP;
      }

      // Lock scrolling completely during transition
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      // Activate cinematic overlay
      if (hero.cinematicOverlay) {
        hero.cinematicOverlay.classList.add('active');
      }

      function step(timestamp) {
        if (startTime === undefined) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = easeInOutQuad(progress);

        // Update cinematic effects based on progress
        updateCinematicEffects(progress, direction);

        window.scrollTo(0, startY + distance * eased);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          autoScrolling = false;

          // Update final state
          currentScrollState = direction === 'down' ? ScrollState.BODY : ScrollState.HERO;

          // Unlock scrolling
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';

          // Deactivate cinematic overlay
          if (hero.cinematicOverlay) {
            setTimeout(() => {
              hero.cinematicOverlay.classList.remove('active');
            }, 300);
          }
        }
      }
      requestAnimationFrame(step);
    }

    /**
     * Update cinematic effects during scroll transition animations.
     * Creates premium visual elements including iris effect, light beams,
     * particles, and film grain.
     *
     * @param {number} progress Animation progress from 0 to 1.
     * @param {string} direction 'down' or 'up' for transition direction.
     */
    function updateCinematicEffects(progress, direction) {
      const effectProgress = direction === 'down' ? progress : 1 - progress;

      // Update iris aperture effect
      if (hero.irisOverlay) {
        const irisScale = 0.1 + (1 - effectProgress) * 3;
        const irisOpacity = effectProgress < 0.5 ? effectProgress * 2 : (1 - effectProgress) * 2;
        hero.irisOverlay.style.transform = `translate(-50%, -50%) scale(${irisScale})`;
        hero.irisOverlay.style.opacity = Math.max(0.3, irisOpacity);
      }

      // Update light beam rotation
      if (hero.lightBeams) {
        const rotation = effectProgress * 180;
        hero.lightBeams.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        hero.lightBeams.style.opacity = effectProgress < 0.5 ? effectProgress * 1.4 : (1 - effectProgress) * 1.4;
      }

      // Update film grain intensity
      if (hero.filmGrain) {
        hero.filmGrain.style.opacity = 0.15 + effectProgress * 0.15;
      }

      // Update vignette intensity
      if (hero.vignette) {
        const vignetteOpacity = 0.3 + effectProgress * 0.4;
        hero.vignette.style.opacity = vignetteOpacity;
      }

      // Animate particles
      if (hero.particlesCanvas && hero.particlesCtx) {
        animateParticles(effectProgress);
      }
    }

    /**
     * Update the parallax visuals based on scroll position.  As the user
     * scrolls down within the hero, scale and darken it; simultaneously
     * fade and slide the next section upward. Enhanced with cinematic
     * blur and color grading effects.
     */
    function updateParallax() {
      const offset = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(offset / heroHeight, 1);

      // Enhanced scale with subtle zoom effect
      const scale = 1 + progress * 0.28;
      hero.style.transform = `scale(${scale.toFixed(3)})`;

      // Enhanced brightness with color temperature shift
      const brightness = 1 - progress * 0.65;
      const blur = progress * 3;
      const saturate = 1 - progress * 0.2;

      hero.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(1)}px) saturate(${saturate.toFixed(2)})`;

      // Update overlay opacity with smoother curve
      const overlayOpacity = Math.pow(progress, 0.8) * 0.75;
      hero.style.setProperty('--overlay-opacity', overlayOpacity.toFixed(3));

      // Smooth fade and translate for next section
      nextSection.style.opacity = progress.toFixed(3);
      const translateY = (1 - progress) * 100;
      nextSection.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    }
    // Particle system for cinematic effect
    let particles = [];
    const particleCount = 40;

    /**
     * Initialize particle system for cinematic transitions
     */
    function initParticles() {
      if (!hero.particlesCanvas) return;

      const canvas = hero.particlesCanvas;
      const ctx = hero.particlesCtx;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    }

    /**
     * Animate particles during cinematic transitions
     */
    function animateParticles(progress) {
      if (!hero.particlesCanvas || !hero.particlesCtx) return;

      const canvas = hero.particlesCanvas;
      const ctx = hero.particlesCtx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow effect
        const particleOpacity = particle.opacity * progress * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        // Golden glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 215, 100, ${particleOpacity})`);
        gradient.addColorStop(0.5, `rgba(255, 180, 50, ${particleOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 140, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();
      });
    }

    // Run once to apply initial state
    if (!isMobile) {
      updateParallax();
      window.addEventListener('scroll', updateParallax, { passive: true });
    }

    /**
     * Enhanced wheel event handler with scroll state machine.
     * Prevents over-scrolling and triggers cinematic transitions.
     */
    if (!isMobile) {
      window.addEventListener(
        'wheel',
        (evt) => {
          // Block all wheel inputs during transitions
          if (autoScrolling || currentScrollState === ScrollState.TRANSITIONING_DOWN || currentScrollState === ScrollState.TRANSITIONING_UP) {
            evt.preventDefault();
            return;
          }

          const delta = evt.deltaY;
          const scrollY = window.pageYOffset;
          const nextTop = nextSection.offsetTop;
          const heroBottom = hero.offsetHeight;

          // Downward scroll from hero section
          if (delta > 0 && currentScrollState === ScrollState.HERO) {
            if (scrollY <= 5) { // Small threshold for reliability
              evt.preventDefault();
              animateScrollTo(nextTop, 2800, 'down');
            }
            return;
          }

          // Upward scroll from body section
          if (delta < 0) {
            const predictedY = scrollY + delta;

            // Prevent over-scrolling: if user is in body section and scrolls up
            // past the boundary, trigger cinematic transition back to hero
            if (currentScrollState === ScrollState.BODY && scrollY > nextTop - 50) {
              // User is at or near the top of body section, scrolling up
              if (predictedY < nextTop || scrollY <= nextTop + 100) {
                evt.preventDefault();
                animateScrollTo(0, 2800, 'up');
                return;
              }
            }

            // If already in the transition zone between hero and body
            if (scrollY > 0 && scrollY < nextTop) {
              evt.preventDefault();
              animateScrollTo(0, 2800, 'up');
              return;
            }
          }

          // Update state based on current scroll position when not transitioning
          if (scrollY <= 10) {
            currentScrollState = ScrollState.HERO;
          } else if (scrollY >= nextTop - 20) {
            currentScrollState = ScrollState.BODY;
          }
        },
        { passive: false }
      );
    }

    /**
     * Hide the header when scrolling down and show it when scrolling up.
     * Adds the `.header-hidden` class defined in styles.css to translate
     * the header off‑screen.  This behaviour only applies after the
     * header has been scrolled past its own height.
     */
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > header.offsetHeight) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    });

    /**
     * Show the header when the user hovers near the top of the viewport
     * after scrolling past the hero section.  When the mouse enters
     * the top area (within the header’s height) and the page is
     * scrolled beyond the first section, remove the `header-hidden`
     * class to reveal the navigation bar.  When the mouse leaves
     * this area, reapply `header-hidden` so the header hides again
     * until the user scrolls up.  This allows users to access the
     * menu while reading lower sections of the page without changing
     * the underlying scroll behaviour.
     */
    document.addEventListener('mousemove', (e) => {
      if (isMobile) return;
      const hoverY = e.clientY;
      const headerHeight = header.offsetHeight;
      const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
      // If cursor is within the header area and we are below the hero, show the header
      if (scrolledPastHero && hoverY <= headerHeight) {
        header.classList.remove('header-hidden');
      } else {
        // Otherwise, if we're still below the hero and not already hiding via scroll up/down,
        // reapply the hidden state.  This avoids leaving the header visible after the cursor
        // moves away from the top edge.
        if (scrolledPastHero && !autoScrolling) {
          header.classList.add('header-hidden');
        }
      }
    });
  }

  // Fade‑in animations for elements with the .animate class.  Use an
  // IntersectionObserver to add the .visible class when elements
  // approach the viewport.
  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (isMobile) {
      animatedEls.forEach((el) => el.classList.add('visible'));
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });
      animatedEls.forEach((el) => obs.observe(el));
    }
  }
  // Immediately show cards in the gallery grid to avoid delayed fade‑in.
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });

  // Mobile navigation toggle: show/hide the nav menu on small screens.
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    };
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
    window.addEventListener(
      'scroll',
      () => {
        if (navMenu.classList.contains('open')) {
          closeMenu();
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});