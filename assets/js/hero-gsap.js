/**
 * HERO GSAP ENGINE (Global)
 * Replaces: hero-cinematic.js
 * Features:
 * - "Hyper-Cinematic" Scroll Effect (Scale, Blur, Parallax, Shutter Bars)
 * - Integrated Matrix Text Scramble (replaces/augments matrix-text.js)
 * - Session-State Protocol (Orb Redirect Logic)
 * - Global Animate.css Batching
 */

(function () {
    'use strict';

    // Register Plugins
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.error("GSAP not loaded.");
        return;
    }

    // --- CONFIGURATION ---
    const CONFIG = {
        scramble: {
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()',
            speed: 50,
            iterations: 3
        },
        hero: {
            scrub: 1.2, // "Luxurious" weight
            pin: true
        }
    };

    // --- STATE ---
    let isSkippedSession = false;

    // --- DOM ELEMENTS ---
    const dom = {
        hero: document.querySelector('.hero.title-band'),
        h1: document.querySelector('.hero h1'),
        nextSection: null, // Found dynamically
        fxLayer: null,
        fxBars: null
    };

    // --- INIT ---
    function init() {
        if (!dom.hero) return; // Not a hero page

        // 1. Setup DOM Elements (Bars, FX Layer)
        setupDOM();

        // 2. Check Session State (Orb Redirect)
        checkSessionState();

        // 3. Matrix Text Effect (Run immediately unless skipped)
        if (!isSkippedSession && dom.h1) {
            runMatrixEffect(dom.h1);
        }

        // 4. Setup ScrollTrigger
        setupScrollAnimation();

        // 5. Setup Global Content Animations
        setupGlobalContentAnimations();
    }

    // --- DOM SETUP ---
    function setupDOM() {
        // FX Layer
        let layer = document.querySelector('.fx-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'fx-layer';
            dom.hero.insertBefore(layer, dom.hero.firstChild);
        }
        dom.fxLayer = layer;

        // Cinema Bars (The "Shutter" effect)
        let bars = document.querySelector('.fx-bars');
        if (!bars) {
            bars = document.createElement('div');
            bars.className = 'fx-bars';
            bars.innerHTML = '<div class="bar top"></div><div class="bar bottom"></div>';
            document.body.appendChild(bars);
        }
        dom.fxBars = bars;

        // Next Section
        dom.nextSection = dom.hero.nextElementSibling;
    }

    // --- SESSION STATE ---
    function checkSessionState() {
        const flag = sessionStorage.getItem('silverstone_skip_hero_anim');
        if (flag === 'true') {
            isSkippedSession = true;
            sessionStorage.removeItem('silverstone_skip_hero_anim');

            // Force state to "End of Scroll" immediately
            // We use a 0-duration tween to set the state
            // But we must allow the ScrollTrigger to pick up from there.
            // Actually, if we use `window.scrollTo`, ScrollTrigger syncs.
            // The Orb logic redirects to an anchor (#neural-grid), so the browser scrolls down.
            // We just need to ensure the Hero doesn't "glitch" or cover the view.

            // We let ScrollTrigger handle the scrub based on scroll position.
            // However, we ensure the H1 is visible (no opacity: 0 default).
        }
    }

    // --- MATRIX TEXT EFFECT ---
    function runMatrixEffect(element) {
        const originalText = element.dataset.originalText || element.innerText;
        element.dataset.originalText = originalText;
        const textLength = originalText.length;

        // Lock Dimensions to prevent layout shift
        const rect = element.getBoundingClientRect();
        element.style.display = 'inline-block';
        element.style.minWidth = `${rect.width}px`;
        element.style.minHeight = `${rect.height}px`;

        let iterations = 0;

        // Ensure visibility
        gsap.set(element, { opacity: 1, filter: 'blur(0px)' });

        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < Math.floor(iterations)) return originalText[index];
                    return CONFIG.scramble.chars[Math.floor(Math.random() * CONFIG.scramble.chars.length)];
                })
                .join('');

            if (iterations >= textLength) {
                clearInterval(interval);
                element.innerText = originalText;
                // Unlock dimensions (optional, but keeping inline-block is safer)
            }

            iterations += 1 / CONFIG.scramble.iterations;
        }, CONFIG.scramble.speed);
    }

    // --- SCROLL ANIMATION (THE QUANTUM REVEAL) ---
    function setupScrollAnimation() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: dom.hero,
                start: "top top",
                end: "bottom top", // Pin for 100vh
                scrub: CONFIG.hero.scrub,
                pin: true,
                pinSpacing: false, // Allow next section to overlap/cover if needed?
                                   // "hero-cinematic" allowed Body to scroll OVER hero.
                                   // With pin:true and pinSpacing:false, the hero stays fixed, and body scrolls UP over it.
                                   // This matches the "Parallax" feel.
                invalidateOnRefresh: true
            }
        });

        // 1. Hero Content Exit (Futuristic Fade/Blur)
        tl.to(dom.h1, {
            y: -150,
            scale: 0.9,
            opacity: 0,
            filter: "blur(20px)",
            ease: "power2.inOut",
            duration: 1
        }, 0);

        // 2. Background Parallax & Dimming
        if (dom.fxLayer) {
            tl.to(dom.fxLayer, {
                backgroundColor: "rgba(0,0,0,0.8)", // Darken significantly
                scale: 1.1, // Slight zoom in (warp effect)
                ease: "none",
                duration: 1
            }, 0);
        }

        // 3. Cinema Bars (Shutter Effect)
        // We want them to close slightly then open?
        // Or just close as we leave the hero?
        // Let's make them close in (10%) as we scroll down to give a "Focus" feel.
        const topBar = dom.fxBars.querySelector('.top');
        const botBar = dom.fxBars.querySelector('.bottom');

        if (topBar && botBar) {
            tl.to([topBar, botBar], {
                height: "10vh", // Close in
                ease: "power1.inOut",
                duration: 0.5,
                yoyo: true, // Go back to 0?
                repeat: 1   // Close then Open?
            }, 0);

            // Actually, `yoyo: true` with scrub means:
            // 0% -> 50% (Close) -> 100% (Open).
            // This creates a "Wipe" effect during the transition.
        }
    }

    // --- GLOBAL CONTENT ANIMATIONS (Animate.css) ---
    function setupGlobalContentAnimations() {
        // Target common "Premium" elements
        // .service-row, .card, .neural-card, section h2, .content-block
        const targets = document.querySelectorAll('.service-row, .card, .neural-card, .innovation-card, section:not(.hero) h2, .content-block');

        if (targets.length === 0) return;

        ScrollTrigger.batch(targets, {
            onEnter: batch => {
                gsap.to(batch, {
                    autoAlpha: 1, // Ensure visibility if hidden
                    onStart: () => {
                        batch.forEach((el, i) => {
                            el.classList.add('animate__animated', 'animate__fadeInUp');
                            // Manual stagger via delay if needed, but batch handles firing.
                            // We can add a slight delay based on index in batch.
                            el.style.animationDelay = `${i * 0.1}s`;
                        });
                    }
                });
            },
            start: "top 85%",
            once: true
        });
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
