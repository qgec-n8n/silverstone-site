/**
 * HERO GSAP ENGINE
 * Replaces: hero-cinematic.js
 * Tech: GSAP ScrollTrigger + Animate.css
 *
 * Logic:
 * 1. Checks 'silverstone_skip_hero_anim' flag.
 * 2. IF TRUE: Forces "Finished" state immediately.
 * 3. IF FALSE: Plays standard intro sequence.
 * 4. "Quantum Reveal" ScrollTrigger for parallax/fade effect.
 * 5. Premium Content Integration (Animate.css batching).
 */

(function () {
    'use strict';

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- DOM ELEMENTS ---
    const heroSection = document.querySelector('.hero.title-band');
    const heroTitle = document.querySelector('.hero h1');
    const fxLayer = document.querySelector('.fx-layer') || createFxLayer(); // Helper to ensure element exists
    const neuralGrid = document.querySelector('#neural-grid');
    const servicesContainer = document.querySelector('.page-services.container');

    // --- HELPER: Create FX Layer if missing ---
    function createFxLayer() {
        if (!heroSection) return null;
        const layer = document.createElement('div');
        layer.className = 'fx-layer';
        // Insert as first child
        heroSection.insertBefore(layer, heroSection.firstChild);
        return layer;
    }

    // --- INIT ---
    function initHeroEngine() {
        if (!heroSection) return;

        const skipAnim = sessionStorage.getItem('silverstone_skip_hero_anim') === 'true';

        if (skipAnim) {
            handleSkippedEntry();
        } else {
            handleStandardEntry();
        }

        setupQuantumReveal();
        setupPremiumContent();
    }

    // --- 1. SKIPPED ENTRY (From Orb) ---
    function handleSkippedEntry() {
        // Force "Finished" State Immediately
        // Opacity 0, Scale 0.9 (as per instructions for "Finished" state?
        // Wait, "Finished" state usually means visible.
        // Instruction: "force the Hero state to 'Finished' (Opacity: 0, Scale: 0.9)."
        // This likely means the Hero is *gone* or *faded out* because the user is deep linked to the grid below.

        gsap.set(heroTitle, { opacity: 0, y: -100, filter: "blur(10px)" });
        // If the hero text is hidden, the background might still be visible or partially hidden.
        // Instruction says: "Animate clipPath... to reveal the content underneath".
        // So "Finished" state corresponds to the state AFTER the user has scrolled past the hero.

        gsap.set(heroSection, { clipPath: "inset(0 0 100% 0)" });

        // Clear flag
        sessionStorage.removeItem('silverstone_skip_hero_anim');

        // Reactivation Trigger: If user scrolls back UP to top
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "100px top",
            onEnterBack: () => {
                // Restore Hero
                gsap.to(heroSection, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power2.out" });
                gsap.to(heroTitle, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.8 });
            }
        });
    }

    // --- 2. STANDARD ENTRY ---
    function handleStandardEntry() {
        // Play Intro Animation
        const tl = gsap.timeline();

        // Initial state
        gsap.set(heroTitle, { opacity: 0, y: 50, filter: "blur(10px)" });
        gsap.set(heroSection, { clipPath: "inset(0 0 0% 0)" });

        tl.to(heroTitle, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power3.out"
        });
    }

    // --- 3. QUANTUM REVEAL (Scroll Effect) ---
    function setupQuantumReveal() {
        // Premium scroll feel

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top", // or "+=100%"
                scrub: 1.5, // Weighted lag
                pin: true,
                pinSpacing: false // Allows content to overlap if needed, or use true if we want standard pinning
            }
        });

        // 1. Target .hero h1: Animate to y: -100, opacity: 0, filter: "blur(10px)"
        tl.to(heroTitle, {
            y: -100,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1
        }, 0);

        // 2. Target .fx-layer: Animate backgroundColor to "rgba(5, 11, 24, 0.9)"
        if (fxLayer) {
            tl.to(fxLayer, {
                backgroundColor: "rgba(5, 11, 24, 0.9)",
                duration: 1
            }, 0);
        }

        // 3. Target .hero.title-band: Animate clipPath to reveal content underneath
        // Note: clip-path inset(0 0 100% 0) wipes it from bottom up.
        tl.to(heroSection, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1
        }, 0);
    }

    // --- 4. PREMIUM CONTENT INTEGRATION (Animate.css) ---
    function setupPremiumContent() {
        // Use ScrollTrigger.batch for .neural-card (children of #neural-grid)
        // Instruction says ".innovation-card", but the HTML shows ".neural-card" inside "#neural-grid".
        // I'll target ".neural-card".

        const cards = document.querySelectorAll('#neural-grid .neural-card');

        if (cards.length > 0) {
            ScrollTrigger.batch(cards, {
                onEnter: batch => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        stagger: 0.1,
                        onStart: (elements) => {
                           // Add Animate.css classes manually or use GSAP to mimic
                           // Instruction: "add the class animate__animated animate__fadeInUp"
                           if (elements && elements.length) { // GSAP 3.x callback params
                                // elements might be the single element or array depending on batch config?
                                // Actually ScrollTrigger.batch calls onEnter with an array of elements.
                                // But `gsap.to(batch` iterates them.
                           }
                        }
                    });

                    batch.forEach((card, i) => {
                        card.classList.add('animate__animated', 'animate__fadeInUp');
                        // Optional: explicit GSAP stagger handling if classes aren't enough or need timing control
                        // But Animate.css handles the animation.
                        // To stagger with Animate.css, we need to add the class with delay.
                        // However, ScrollTrigger.batch handles the triggering.
                        // Stagger: 0.1 in the batch config itself or via the onEnter callback logic.

                        // Refined approach:
                        // Just add the class. If we want stagger, we can set animation-delay via JS.
                         card.style.animationDelay = `${i * 0.1}s`;
                         // Wait, `i` here is index in the batch, so it resets per batch. That is good.
                    });
                },
                start: "top 85%",
                once: true // Play once
            });
        }

        // Also handle other .service-row items if needed, but instruction emphasized #neural-grid.
    }

    // Run Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroEngine);
    } else {
        initHeroEngine();
    }

})();
