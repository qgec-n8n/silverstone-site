// assets/js/hero-gsap.js
// Replaces hero-cinematic.js with GSAP 3 + ScrollTrigger implementation
// Handles Session-State Reactivation Protocol for services.html

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize & Checks
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector('.hero.title-band');
    if (!hero) return;

    // Detect environment
    const isServices = window.location.pathname.includes('services.html') || document.body.classList.contains('page-services');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768; // Simple breakpoint

    // 2. Visual Parity: Inject FX layers if missing (mimic old script structure)
    // allowing us to keep using hero-cinematic.css or similar styles
    const ensureElement = (className, parent, prepend = false) => {
        if (!parent.querySelector(`.${className}`)) {
            const el = document.createElement('div');
            el.className = className;
            el.setAttribute('aria-hidden', 'true');
            if (prepend && parent.firstChild) {
                parent.insertBefore(el, parent.firstChild);
            } else {
                parent.appendChild(el);
            }
        }
    };

    ensureElement('fx-layer', hero, true);
    ensureElement('fx-bloom', hero);
    ensureElement('fx-aurora', hero);

    if (!document.querySelector('.fx-bars')) {
        const bars = document.createElement('div');
        bars.className = 'fx-bars';
        bars.innerHTML = '<div class="bar top"></div><div class="bar bottom"></div><div class="flare"></div>';
        document.body.appendChild(bars);
    }

    // 3. Session State Management (FSM)
    const skipRequested = sessionStorage.getItem('silverstone_skip_hero_anim') === 'true';
    const hasHash = window.location.hash === '#neural-grid';
    const orbRedirect = sessionStorage.getItem('silverstone_orb_redirect') === 'true';

    // Handle Singularity Overlay (Orb Arrival)
    if (orbRedirect) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'singularity-overlay';
        // Style inline for robustness
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '9999',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            opacity: '1',
            pointerEvents: 'none'
        });
        document.body.appendChild(overlay);

        // Fade out
        gsap.to(overlay, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => overlay.remove()
        });

        // Clear flag
        sessionStorage.removeItem('silverstone_orb_redirect');
    }

    // 4. Hero Logic
    if (isServices && (skipRequested || hasHash)) {
        // STATE B: Gallery Entry / Skipped
        // Immediately set hero to "finished" state
        // We use the CSS variables that the CSS expects, or set properties directly
        // The old CSS used --heroProgress (0 to 1), --heroDepth, --cineVeil

        gsap.set(hero, {
            '--heroProgress': 1,
            '--heroDepth': 1.15
        });
        gsap.set(document.documentElement, { '--cineVeil': 0 });

        // Clean up session flag
        sessionStorage.removeItem('silverstone_skip_hero_anim');

        // Scroll correction for Hash
        if (hasHash) {
            const target = document.querySelector('#neural-grid');
            if (target) {
                // Small timeout to allow layout to settle
                setTimeout(() => {
                    target.scrollIntoView({ block: 'start' });
                }, 50);
            }
        }

        // Reactivation Mechanism: If user scrolls back UP to hero, re-enable animation
        ScrollTrigger.create({
            trigger: hero,
            start: 'top bottom', // When hero bottom enters viewport from top?
            // Actually, if we are at #neural-grid (below hero), and we scroll UP.
            // We want to detect when the hero comes back into view.
            onEnterBack: () => {
                // Re-enable cinematic feel?
                // For now, we just ensure it doesn't look broken.
                // We can register the timeline now if we want full reverse animation.
                if (!reducedMotion && !isMobile) {
                    createHeroTimeline();
                }
            },
            once: true
        });

    } else {
        // STATE A: Standard Entry
        if (!reducedMotion && !isMobile) {
            createHeroTimeline();
        }
    }

    function createHeroTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: '+=100%', // Pin for 100% viewport height
                pin: true,
                scrub: 1.5, // Smooth scrub
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Cinematic Animation Sequence
        // 1. Content Fade & Lift
        const content = hero.querySelectorAll('.content h1, .content p, .content .btn');
        if (content.length) {
            tl.to(content, {
                y: -80,
                opacity: 0,
                filter: 'blur(10px)',
                stagger: 0.05,
                duration: 0.8,
                ease: 'power2.inOut'
            }, 0);
        }

        // 2. Background/FX Evolution
        // Drive CSS variables for the existing CSS effects (bloom, aurora, etc.)
        tl.to(hero, {
            '--heroProgress': 1,
            '--heroDepth': 1.15,
            duration: 1,
            ease: 'power1.inOut'
        }, 0);

        // Veil darken/lighten
        // Old script: 0.45 -> 0 on scroll down
        tl.fromTo(document.documentElement,
            { '--cineVeil': 0.45 },
            { '--cineVeil': 0, duration: 1, ease: 'none' },
        0);

        // 3. Clip Path Reveal (Apple/Google style)
        // This clips the hero content as it scrolls, revealing what's behind/underneath
        // We use a custom clip path animation
        tl.to(hero, {
            clipPath: 'inset(0 0 100% 0)', // Wipe up
            ease: 'none', // Linear with scroll
            duration: 1
        }, 0);

        // Ensure Shutter Bars wipe if they exist
        // tl.to('.fx-bars .bar', { ... }) // Optional, if we want to animate bars
    }

    // 5. Global Micro-Animations (Scroll Reveals) for Sections
    // Only if not reduced motion
    if (!reducedMotion) {
        const sections = document.querySelectorAll('.section:not(.hero)');
        sections.forEach(section => {
            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Neural Grid Cards Micro-interactions handled by CSS hover mostly,
        // but we can add entrance animation
        const cards = document.querySelectorAll('.neural-card');
        if (cards.length) {
            ScrollTrigger.batch(cards, {
                onEnter: batch => gsap.fromTo(batch,
                    { opacity: 0, y: 20, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, stagger: 0.1, ease: 'back.out(1.2)' }
                ),
                start: 'top 90%'
            });
        }
    }

    // 6. Animate.css Integration (Scroll Triggered)
    if (!reducedMotion) {
        // Section Titles
        gsap.utils.toArray('.section-title').forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: 'top 85%',
                onEnter: () => title.classList.add('animate__animated', 'animate__fadeInUp'),
                once: true
            });
        });

        // Key CTAs in body
        gsap.utils.toArray('.section:not(.hero) .btn').forEach(btn => {
             ScrollTrigger.create({
                trigger: btn,
                start: 'top 90%',
                onEnter: () => btn.classList.add('animate__animated', 'animate__fadeInUp'),
                once: true
            });
        });
    }
});
