/*
 * Silverstone Premium Scroll Transition - Optimized Version
 * 
 * This implementation provides a buttery-smooth parallax transition between
 * the hero and body sections using performance best practices:
 * - Hardware-accelerated transforms only
 * - Efficient RAF loop with frame skipping
 * - Simplified calculations
 * - Passive event listeners
 * - CSS containment for optimal rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  // Performance optimization: Use passive listeners and check for support
  const supportsPassive = (() => {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {}
    return passiveSupported;
  })();

  const passiveOpt = supportsPassive ? { passive: true } : false;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Detect mobile/Safari
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const isMobile = window.innerWidth <= 900 || isSafari || prefersReducedMotion;

  // Cache DOM elements
  const hero = document.querySelector('.hero');
  const header = document.querySelector('header');
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

  const hasHeroStructure = Boolean(hero && nextSection && header);

  if (hasHeroStructure && !isMobile) {
    // Initialize performance-optimized styles
    const initializeStyles = () => {
      // Add GPU-accelerated classes
      hero.style.willChange = 'transform';
      hero.style.transform = 'translate3d(0,0,0)';
      hero.style.backfaceVisibility = 'hidden';
      hero.style.perspective = '1000px';
      
      nextSection.style.willChange = 'transform, opacity';
      nextSection.style.transform = 'translate3d(0, 60px, 0)';
      nextSection.style.opacity = '0';
      nextSection.style.backfaceVisibility = 'hidden';
      
      // Add transition for smooth animation
      hero.style.transition = 'none';
      nextSection.style.transition = 'none';
    };

    initializeStyles();

    // Performance variables
    let ticking = false;
    let lastScrollY = 0;
    let heroHeight = hero.offsetHeight;
    let scrollProgress = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = null;
    let isTransitioning = false;
    let autoScrolling = false;

    // Optimized easing function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // Simplified transform application
    const applyTransforms = (progress) => {
      // Hero transforms - minimal properties for performance
      const heroScale = 1 + progress * 0.15; // Reduced scale for subtlety
      const heroY = progress * -50; // Slight upward movement
      const heroOpacity = 1 - progress * 0.3; // Gentle fade
      
      // Body section transforms
      const sectionY = (1 - progress) * 60;
      const sectionOpacity = progress;
      
      // Apply transforms using transform3d for GPU acceleration
      hero.style.transform = `translate3d(0, ${heroY}px, 0) scale(${heroScale})`;
      hero.style.opacity = heroOpacity;
      
      nextSection.style.transform = `translate3d(0, ${sectionY}px, 0)`;
      nextSection.style.opacity = sectionOpacity;
    };

    // Optimized scroll handler with RAF
    const updateScroll = () => {
      const scrollY = window.pageYOffset;
      targetProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      
      if (!ticking && !autoScrolling) {
        requestAnimationFrame(updateTransforms);
        ticking = true;
      }
    };

    // Smooth interpolation for transforms
    const updateTransforms = () => {
      // Interpolate towards target for smoothness
      const diff = targetProgress - currentProgress;
      
      if (Math.abs(diff) > 0.001) {
        currentProgress += diff * 0.1; // Smooth interpolation factor
        applyTransforms(currentProgress);
        rafId = requestAnimationFrame(updateTransforms);
      } else {
        currentProgress = targetProgress;
        applyTransforms(currentProgress);
        ticking = false;
      }
    };

    // Smooth scroll to position
    const smoothScrollTo = (targetY, duration = 1000) => {
      return new Promise((resolve) => {
        autoScrolling = true;
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutQuad(progress);
          
          window.scrollTo(0, startY + distance * eased);
          
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            autoScrolling = false;
            resolve();
          }
        };

        requestAnimationFrame(animateScroll);
      });
    };

    // Trigger zones for automatic scrolling
    const handleScrollTriggers = () => {
      if (isTransitioning || autoScrolling) return;
      
      const scrollY = window.pageYOffset;
      const threshold = 50; // Trigger threshold in pixels
      const nextTop = nextSection.offsetTop;
      
      // Trigger scroll down
      if (scrollY > 0 && scrollY < threshold && lastScrollY < scrollY) {
        isTransitioning = true;
        smoothScrollTo(nextTop, 800).then(() => {
          isTransitioning = false;
        });
      }
      
      // Trigger scroll up
      if (scrollY < nextTop && scrollY > nextTop - threshold && lastScrollY > scrollY) {
        isTransitioning = true;
        smoothScrollTo(0, 800).then(() => {
          isTransitioning = false;
        });
      }
      
      lastScrollY = scrollY;
    };

    // Optimized scroll listener
    let scrollTimeout;
    const handleScroll = () => {
      updateScroll();
      
      // Debounce trigger checks
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollTriggers, 50);
    };

    // Optimized wheel handler
    const handleWheel = (e) => {
      if (autoScrolling || isTransitioning) {
        e.preventDefault();
        return;
      }
      
      const delta = e.deltaY;
      const scrollY = window.pageYOffset;
      const nextTop = nextSection.offsetTop;
      
      // Smart triggering based on scroll direction and position
      if (delta > 0 && scrollY < 10) {
        e.preventDefault();
        isTransitioning = true;
        smoothScrollTo(nextTop, 800).then(() => {
          isTransitioning = false;
        });
      } else if (delta < 0 && scrollY >= nextTop - 10 && scrollY <= nextTop + 10) {
        e.preventDefault();
        isTransitioning = true;
        smoothScrollTo(0, 800).then(() => {
          isTransitioning = false;
        });
      }
    };

    // Update hero height on resize
    const handleResize = () => {
      heroHeight = hero.offsetHeight;
      updateScroll();
    };

    // Attach optimized event listeners
    window.addEventListener('scroll', handleScroll, passiveOpt);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize, passiveOpt);

    // Initialize
    updateScroll();
  }

  // Header hide/show on scroll
  if (header) {
    let lastScrollTop = 0;
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      
      lastScrollTop = scrollTop;
    }, passiveOpt);
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    
    // Close menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // Fade-in animations with Intersection Observer
  const animatedElements = document.querySelectorAll('.animate');
  if (animatedElements.length > 0) {
    if (isMobile) {
      animatedElements.forEach(el => el.classList.add('visible'));
    } else {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      animatedElements.forEach(el => observer.observe(el));
    }
  }

  // Immediately show gallery cards
  document.querySelectorAll('.gallery-grid .neon-card').forEach(el => {
    el.classList.add('visible');
  });
});
