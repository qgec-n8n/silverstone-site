/**
 * HERO ENGINE GSAP: Premium Cinematic Scroll & Animations
 * Replaces legacy hero-cinematic.js
 *
 * Features:
 * 1. Session-State Reactivation: Checks 'silverstone_skip_hero_anim' to skip intro.
 * 2. GSAP ScrollTrigger: Pins hero, scrubs timeline (Text Fade/Blur, Veil Darken).
 * 3. Global Animations: Batch fades for service cards using Animate.css classes.
 */

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    class HeroEngine {
        constructor() {
            this.heroSection = document.querySelector('.hero.title-band');
            this.heroContent = document.querySelector('.hero.title-band .content');
            this.heroVeil = document.querySelector('.fx-veil') || this.createVeil();
            this.skipAnim = sessionStorage.getItem('silverstone_skip_hero_anim') === 'true';

            this.init();
        }

        createVeil() {
            // Create veil if it doesn't exist (needed for darkening effect)
            const nextSection = this.heroSection?.nextElementSibling;
            if (nextSection) {
                let veil = nextSection.querySelector('.fx-veil');
                if (!veil) {
                    veil = document.createElement('div');
                    veil.className = 'fx-veil';
                    veil.setAttribute("aria-hidden", "true");
                    // Ensure veil is positioned to cover the content
                    if (getComputedStyle(nextSection).position === 'static') {
                        nextSection.style.position = 'relative';
                    }
                    nextSection.insertBefore(veil, nextSection.firstChild);
                }
                return veil;
            }
            return null;
        }

        init() {
            if (!this.heroSection) return;

            // 1. Session State Check
            if (this.skipAnim) {
                // FORCE END STATE
                gsap.set(this.heroContent, { autoAlpha: 0, y: -150, filter: "blur(15px)" });
                if (this.heroVeil) gsap.set(this.heroVeil, { backgroundColor: "rgba(0,0,0,0.8)" });

                // Clear flag so next normal visit plays intro
                sessionStorage.removeItem('silverstone_skip_hero_anim');
            } else {
                // PLAY INTRO
                this.playIntro();
            }

            // 2. Setup Scroll Scrub (Hero to Body)
            this.setupHeroScroll();

            // 3. Global Animations (Premium Entry)
            this.setupGlobalAnimations();
        }

        playIntro() {
            // Simple entry animation if not skipped
            gsap.fromTo(this.heroContent,
                { autoAlpha: 0, y: 30, filter: "blur(10px)" },
                { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out", delay: 0.2 }
            );
        }

        setupHeroScroll() {
            // Pin the hero and scrub the transition
            // The effect: As user scrolls, hero stays pinned, content fades out/blurs, veil darkens.

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.heroSection,
                    start: "top top",
                    end: "+=100%", // Scroll distance equal to viewport height
                    pin: true,
                    scrub: 1.5, // The "Premium/Luxurious" weighted feel
                    anticipatePin: 1
                }
            });

            tl.to(this.heroContent, {
                y: -150,
                autoAlpha: 0,
                filter: "blur(15px)",
                ease: "none"
            }, 0)
            .to(this.heroVeil, {
                backgroundColor: "rgba(0,0,0,0.8)",
                ease: "none"
            }, 0);
        }

        setupGlobalAnimations() {
            // Batch animate elements as they enter viewport
            // Targets: .service-card, .innovation-item, .content-block, .feature-card, .neon-card (if inside grids)

            const targets = ".service-card, .innovation-item, .content-block, .feature-card, .neon-card, .service-row";

            ScrollTrigger.batch(targets, {
                onEnter: batch => {
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        stagger: 0.1,
                        overwrite: true,
                        duration: 0.8,
                        ease: "power3.out",
                        onStart: () => {
                            batch.forEach(el => el.classList.add('animate__animated', 'animate__fadeInUp'));
                        }
                    });
                },
                start: "top 85%" // Trigger when top of element hits 85% of viewport height
            });
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new HeroEngine());
    } else {
        new HeroEngine();
    }

})();
