
/* =========================================================
   HYPERGARUDA — CORPORATE MOTION ENGINE
   Vanilla JavaScript + optional GSAP / ScrollTrigger
   File: Script.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const HG = {
        reducedMotion: reducedMotionQuery.matches,

        mobile: window.matchMedia("(max-width: 760px)"),

        gsap: typeof window.gsap !== "undefined"
            ? window.gsap
            : null,

        scrollTrigger: typeof window.ScrollTrigger !== "undefined"
            ? window.ScrollTrigger
            : null
    };

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    const isGSAP = Boolean(HG.gsap && !HG.reducedMotion);

    /* -----------------------------------------------------
       1. SYSTEM INITIALIZATION
       ----------------------------------------------------- */

    document.documentElement.classList.add("js-enabled");

    setupReducedMotionPreference();

    if (HG.gsap && HG.scrollTrigger) {
        HG.gsap.registerPlugin(HG.scrollTrigger);
    }

    console.info(
        `[HyperGaruda] Motion Engine online | ${
            isGSAP ? "GSAP" : "Native / reduced motion"
        }`
    );

    injectMotionStyles();
    updateCopyright();
    setupNavigation();
    setupScrollProgress();
    setupBackToTop();
    setupRevealAnimations();
    setupCounters();
    setupCardInteractions();
    setupMorphGlass();
    setupPageTransitions();
    setupErrorPages();
    setupCvdAdaptation();

    /* -----------------------------------------------------
       2. LIVE REDUCED-MOTION PREFERENCE
       ----------------------------------------------------- */

    function setupReducedMotionPreference() {
        const applyPreference = () => {
            HG.reducedMotion = reducedMotionQuery.matches;
            document.documentElement.classList.toggle(
                "hg-reduced-motion",
                HG.reducedMotion
            );

            if (!HG.reducedMotion) return;

            // Stop in-flight scripted motion instead of relying on CSS alone.
            if (HG.gsap) {
                HG.gsap.globalTimeline
                    .getChildren(true, true, true)
                    .forEach(animation => animation.kill());
            }

            if (HG.scrollTrigger) {
                HG.scrollTrigger.getAll().forEach(trigger => trigger.kill());
            }

            $(".hg-reveal, .hg-reveal-left, .hg-reveal-right, .hg-reveal-scale")
                .forEach(element => element.classList.add("hg-visible"));

            $("[data-count]").forEach(counter => {
                const target = Number(counter.dataset.count);
                if (!Number.isFinite(target)) return;
                const prefix = counter.dataset.prefix || "";
                const suffix = counter.dataset.suffix || "";
                counter.textContent =
                    `${prefix}${Math.round(target).toLocaleString()}${suffix}`;
            });

            $("video").forEach(video => {
                video.pause();
                video.autoplay = false;
                video.removeAttribute("autoplay");
            });
        };

        applyPreference();

        if (typeof reducedMotionQuery.addEventListener === "function") {
            reducedMotionQuery.addEventListener("change", applyPreference);
        } else if (typeof reducedMotionQuery.addListener === "function") {
            reducedMotionQuery.addListener(applyPreference);
        }
    }

    /* -----------------------------------------------------
       3. DYNAMIC COPYRIGHT YEAR
       ----------------------------------------------------- */

    function updateCopyright() {
        const year = new Date().getFullYear();

        const yearElements = $$("#current-year");

        yearElements.forEach(element => {
            element.textContent = year;
        });

        const footer = $(
            ".site-footer p, .footer p, footer p"
        );

        if (footer && !footer.querySelector("#current-year")) {
            const copyrightText = footer.textContent || "";

            if (/©\s*\d{4}/.test(copyrightText)) {
                footer.textContent = copyrightText.replace(
                    /©\s*\d{4}/,
                    `© ${year}`
                );
            }
        }
    }

    /* -----------------------------------------------------
       3. INJECTED MOTION STYLES
       No need to replace Style.css.
       ----------------------------------------------------- */

    function injectMotionStyles() {
        if ($("#hg-motion-styles")) return;

        const style = document.createElement("style");
        style.id = "hg-motion-styles";

        style.textContent = `
            :root {
                --hg-motion-fast: 180ms;
                --hg-motion-normal: 360ms;
                --hg-motion-slow: 650ms;
                --hg-ease: cubic-bezier(.22, 1, .36, 1);
            }

            html {
                scroll-behavior: smooth;
                scroll-padding-top: 90px;
            }

            body {
                opacity: 1;
            }

            .hg-motion-ready .hg-reveal {
                opacity: 0;
                transform: translate3d(0, 24px, 0);
            }

            .hg-motion-ready .hg-reveal.hg-visible {
                opacity: 1;
                transform: translate3d(0, 0, 0);
                transition:
                    opacity 650ms var(--hg-ease),
                    transform 650ms var(--hg-ease);
            }

            .hg-motion-ready .hg-reveal-left {
                opacity: 0;
                transform: translate3d(-24px, 0, 0);
            }

            .hg-motion-ready .hg-reveal-right {
                opacity: 0;
                transform: translate3d(24px, 0, 0);
            }

            .hg-motion-ready .hg-reveal-scale {
                opacity: 0;
                transform: scale(.96);
            }

            .hg-motion-ready .hg-reveal-left.hg-visible,
            .hg-motion-ready .hg-reveal-right.hg-visible,
            .hg-motion-ready .hg-reveal-scale.hg-visible {
                opacity: 1;
                transform: none;
                transition:
                    opacity 650ms var(--hg-ease),
                    transform 650ms var(--hg-ease);
            }

            #hg-scroll-progress {
                position: fixed;
                z-index: 9999;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                pointer-events: none;
                background: var(--accent, #cc2200);
                box-shadow: 0 0 12px
                    color-mix(in srgb, var(--accent, #cc2200) 45%, transparent);
                transform-origin: left center;
            }

            .hg-menu-toggle {
                display: none;
                align-items: center;
                justify-content: center;
                gap: 5px;
                flex-direction: column;
                width: 42px;
                height: 42px;
                padding: 9px;
                border: 1px solid rgba(255,255,255,.14);
                border-radius: 10px;
                background: var(--bg-secondary, #12121a);
                color: var(--text-primary, #f5f5f7);
                cursor: pointer;
            }

            .hg-menu-toggle span {
                display: block;
                width: 19px;
                height: 2px;
                border-radius: 2px;
                background: currentColor;
                transition:
                    transform 220ms ease,
                    opacity 180ms ease;
            }

            .hg-menu-toggle[aria-expanded="true"] span:first-child {
                transform: translateY(7px) rotate(45deg);
            }

            .hg-menu-toggle[aria-expanded="true"] span:nth-child(2) {
                opacity: 0;
            }

            .hg-menu-toggle[aria-expanded="true"] span:last-child {
                transform: translateY(-7px) rotate(-45deg);
            }

            .hg-current-link {
                color: var(--text-primary, #f5f5f7) !important;
            }

            .hg-skip-link {
                position: fixed;
                z-index: 10001;
                top: 12px;
                left: 12px;
                padding: 12px 16px;
                border: 2px solid var(--accent-gold, #c0a020);
                border-radius: 8px;
                background: var(--bg-secondary, #12121a);
                color: var(--text-primary, #f5f5f7);
                font-weight: 700;
                transform: translateY(-160%);
            }

            .hg-skip-link:focus {
                transform: translateY(0);
                outline: 3px solid var(--accent-gold, #c0a020);
                outline-offset: 3px;
            }

            #hg-back-to-top {
                position: fixed;
                z-index: 999;
                right: 22px;
                /* Keep the control above the fixed Netlify badge injected in production. */
                bottom: 80px;
                width: 46px;
                height: 46px;
                display: grid;
                place-items: center;
                border: 1px solid rgba(255,255,255,.15);
                border-radius: 14px;
                background: var(--bg-secondary, #12121a);
                color: var(--text-primary, #f5f5f7);
                font-size: 21px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition:
                    opacity 220ms ease,
                    transform 220ms ease,
                    visibility 220ms ease,
                    border-color 220ms ease;
            }

            #hg-back-to-top.hg-show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            #hg-back-to-top:hover {
                border-color: var(--accent, #cc2200);
            }

            .hg-transition-overlay {
                position: fixed;
                z-index: 10000;
                inset: 0;
                pointer-events: none;
                background: var(--bg-primary, #0a0a0f);
                opacity: 0;
                transition: opacity 220ms ease;
            }

            .hg-transition-overlay.hg-transition-active {
                opacity: 1;
                pointer-events: auto;
            }

            .hg-motion-card {
                transform: translateZ(0);
                transition:
                    border-color 240ms ease,
                    box-shadow 240ms ease;
            }

            .hg-motion-card:hover {
                border-color: rgba(204,34,0,.45);
                box-shadow: 0 12px 34px rgba(0,0,0,.16);
            }

            .hg-motion-button {
                transition:
                    transform 180ms ease,
                    filter 180ms ease,
                    box-shadow 180ms ease;
            }

            .hg-motion-button:hover {
                filter: brightness(1.08);
            }

            .hg-motion-button:active {
                transform: scale(.97);
            }

            .error-code {
                will-change: transform;
            }

            @media (max-width: 760px) {
                .navbar {
                    position: relative;
                }

                .hg-menu-toggle {
                    display: inline-flex;
                    flex: 0 0 auto;
                    margin-left: auto;
                }

                .navbar .nav-links.hg-mobile-menu {
                    position: absolute;
                    z-index: 2000;
                    top: calc(100% + 10px);
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 4px;
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 14px;
                    background: var(--bg-secondary, #12121a);
                    box-shadow: 0 16px 36px rgba(0,0,0,.28);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-8px);
                    transition:
                        opacity 180ms ease,
                        transform 180ms ease,
                        visibility 180ms ease;
                }

                .navbar .nav-links.hg-mobile-menu.hg-menu-open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .navbar .nav-links.hg-mobile-menu a {
                    display: block;
                    padding: 11px 12px;
                    border-radius: 8px;
                }

                #hg-back-to-top {
                    right: 14px;
                    /* Preserve clearance above the fixed Netlify badge on mobile too. */
                    width: 42px;
                    height: 42px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                html {
                    scroll-behavior: auto !important;
                }

                *, *::before, *::after {
                    animation-duration: .01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: .01ms !important;
                    scroll-behavior: auto !important;
                }

                .hg-motion-ready .hg-reveal,
                .hg-motion-ready .hg-reveal-left,
                .hg-motion-ready .hg-reveal-right,
                .hg-motion-ready .hg-reveal-scale {
                    opacity: 1 !important;
                    transform: none !important;
                }
            }

            html.hg-reduced-motion {
                scroll-behavior: auto !important;
            }

            html.hg-reduced-motion *,
            html.hg-reduced-motion *::before,
            html.hg-reduced-motion *::after {
                animation-duration: .01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: .01ms !important;
                scroll-behavior: auto !important;
            }

            html.hg-reduced-motion .hg-motion-ready .hg-reveal,
            html.hg-reduced-motion .hg-motion-ready .hg-reveal-left,
            html.hg-reduced-motion .hg-motion-ready .hg-reveal-right,
            html.hg-reduced-motion .hg-motion-ready .hg-reveal-scale,
            html.hg-reduced-motion .hg-reveal,
            html.hg-reduced-motion .hg-reveal-left,
            html.hg-reduced-motion .hg-reveal-right,
            html.hg-reduced-motion .hg-reveal-scale {
                opacity: 1 !important;
                transform: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    /* -----------------------------------------------------
       4. NAVIGATION
       ----------------------------------------------------- */

    function setupNavigation() {
        const navbar = $(".navbar");
        const navLinks = $(".nav-links");

        if (!navbar || !navLinks) return;

        const links = $$("a[href]", navLinks);
        const currentPath = normalizePath(location.pathname);
        setupSkipLink(navbar);

        links.forEach(link => {
            // The Dynamic Hub placeholder is an external companion link, not
            // a route in this site. Never expose it as the current page.
            if (link.id === "dynamic-hub-link") {
                link.removeAttribute("aria-current");
                link.classList.remove("hg-current-link");
                return;
            }

            let target;

            try {
                target = new URL(link.href, location.href);
            } catch {
                return;
            }

            if (
                target.origin === location.origin &&
                normalizePath(target.pathname) === currentPath
            ) {
                link.classList.add("hg-current-link");
                link.setAttribute("aria-current", "page");
            }
        });

        // Do not create duplicate menu buttons.
        if ( $(".hg-menu-toggle", navbar) ) return;

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "hg-menu-toggle";
        toggle.setAttribute("aria-label", "Toggle navigation");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        const logo = $(".logo", navbar);

        if (logo && logo.nextSibling) {
            navbar.insertBefore(toggle, logo.nextSibling);
        } else {
            navbar.appendChild(toggle);
        }

        navLinks.classList.add("hg-mobile-menu");
        navLinks.id ||= "hg-navigation";

        toggle.setAttribute("aria-controls", navLinks.id);

        function closeMenu() {
            toggle.setAttribute("aria-expanded", "false");
            navLinks.classList.remove("hg-menu-open");
        }

        toggle.addEventListener("click", () => {
            const open =
                toggle.getAttribute("aria-expanded") !== "true";

            toggle.setAttribute("aria-expanded", String(open));
            navLinks.classList.toggle("hg-menu-open", open);
        });

        links.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        navLinks.addEventListener("focusout", event => {
            if (!navLinks.contains(event.relatedTarget)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" &&
                toggle.getAttribute("aria-expanded") === "true") {
                closeMenu();
                toggle.focus();
            }
        });

        HG.mobile.addEventListener?.("change", closeMenu);
    }

    function setupSkipLink(navbar) {
        const main = $("main");
        if (!main) return;

        main.id ||= "main-content";
        main.tabIndex = -1;
        if ($(".hg-skip-link")) return;

        const skipLink = document.createElement("a");
        skipLink.className = "hg-skip-link";
        skipLink.href = "#" + main.id;
        skipLink.textContent = "Skip to main content";
        navbar.parentNode?.insertBefore(skipLink, navbar);
    }

    function normalizePath(path) {
        const clean = path.replace(/\/+$/, "");
        return clean || "/";
    }

    /* -----------------------------------------------------
       5. SCROLL PROGRESS
       ----------------------------------------------------- */

    function setupScrollProgress() {
        const bar = document.createElement("div");
        bar.id = "hg-scroll-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        let ticking = false;

        function update() {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;

            const maxScroll =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage = maxScroll > 0
                ? Math.min(100, Math.max(0, scrollTop / maxScroll * 100))
                : 0;

            bar.style.width = `${percentage}%`;
            ticking = false;
        }

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener("resize", update, { passive: true });

        update();
    }

    /* -----------------------------------------------------
       6. BACK TO TOP
       ----------------------------------------------------- */

    function setupBackToTop() {
        const button = document.createElement("button");

        button.id = "hg-back-to-top";
        button.type = "button";
        button.textContent = "↑";
        button.setAttribute("aria-label", "Back to top");

        document.body.appendChild(button);

        function updateVisibility() {
            button.classList.toggle("hg-show", window.scrollY > 450);
        }

        window.addEventListener("scroll", updateVisibility, {
            passive: true
        });

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: HG.reducedMotion ? "auto" : "smooth"
            });
        });

        updateVisibility();
    }

    /* -----------------------------------------------------
       7. SCROLL REVEAL ANIMATIONS
       ----------------------------------------------------- */

    function setupRevealAnimations() {
        const selectors = [
            ".hero h1",
            ".hero h2",
            ".hero p",
            ".hero .btn",
            ".hero .button",
            ".about-section h2",
            ".projects-section h2",
            "main section h2",
            ".section-title",
            ".about-card",
            ".project-card",
            ".project-item",
            ".experience-card",
            ".mission-card",
            ".social-card",
            ".contact-card",
            ".skill-card",
            ".stat-card",
            ".mission-item",
            ".contact-item",
            ".contact-channel",
            ".collaboration-card",
            ".error-description",
            ".error-terminal",
            ".error-actions",
            ".error-video",
            ".error-footer"
        ];

        const elements = [...new Set(
            selectors.flatMap(selector => $$(selector))
        )];

        elements.forEach(element => {
            if (
                element.closest(".navbar") ||
                element.closest("#hg-back-to-top") ||
                element.dataset.noReveal === "true"
            ) {
                return;
            }

            if (
                element.matches(".hero h1, .hero h2")
            ) {
                element.classList.add("hg-reveal");
            } else if (
                element.matches(".project-card, .project-item, .contact-card")
            ) {
                element.classList.add("hg-reveal-scale");
            } else {
                element.classList.add("hg-reveal");
            }
        });

        if (HG.reducedMotion) {
            elements.forEach(element => {
                element.classList.add("hg-visible");
            });
            return;
        }

        if (isGSAP) {
            animateWithGSAP(elements);
        } else {
            animateWithObserver(elements);
        }
    }

    function animateWithGSAP(elements) {
        const gsap = HG.gsap;


        // Navbar entrance.
        const navbar = $(".navbar");

        if (navbar) {
            gsap.from(navbar, {
                y: -18,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                clearProps: "all"
            });
        }

        // Hero content.
        const heroElements = $$(".hero h1, .hero h2, .hero p, .hero .btn, .hero .button");

        if (heroElements.length) {
            gsap.from(heroElements, {
                y: 24,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.1,
                clearProps: "all"
            });
        }

        // Error-page entrance.
        const errorPanel = $(".error-panel");

        if (errorPanel) {
            gsap.from(errorPanel, {
                y: 18,
                opacity: 0,
                scale: 0.985,
                duration: 0.75,
                ease: "power3.out",
                clearProps: "all"
            });
        }

        // Reveal items as they enter the viewport.
        const revealItems = elements.filter(element =>
            element.classList.contains("hg-reveal") ||
            element.classList.contains("hg-reveal-left") ||
            element.classList.contains("hg-reveal-right") ||
            element.classList.contains("hg-reveal-scale")
        );

        if (HG.scrollTrigger) {
            revealItems.forEach(element => {
                gsap.fromTo(
                    element,
                    {
                        opacity: 0,
                        y: element.classList.contains("hg-reveal-scale")
                            ? 0
                            : 22,
                        scale: element.classList.contains("hg-reveal-scale")
                            ? 0.96
                            : 1
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        ease: "power3.out",
                        clearProps: "transform",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 88%",
                            once: true
                        }
                    }
                );
            });
        } else {
            animateWithObserver(revealItems);
        }
    }

    function animateWithObserver(elements) {
        if (!("IntersectionObserver" in window)) {
            elements.forEach(element => {
                element.classList.add("hg-visible");
            });
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("hg-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        });

        elements.forEach(element => {
            if (
                element.matches(".navbar, .hero h1, .hero h2") &&
                element.getBoundingClientRect().top < window.innerHeight
            ) {
                element.classList.add("hg-visible");
                return;
            }

            observer.observe(element);
        });
    }

    /* -----------------------------------------------------
       8. OPTIONAL NUMBER COUNTERS
       Activate by adding data-count="100" to an element.
       ----------------------------------------------------- */

    function setupCounters() {
        const counters = $$("[data-count]");

        if (!counters.length) return;

        counters.forEach(counter => {
            const target = Number(counter.dataset.count);

            if (!Number.isFinite(target)) return;

            const prefix = counter.dataset.prefix || "";
            const suffix = counter.dataset.suffix || "";

            function render(value) {
                counter.textContent =
                    `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
            }

            if (HG.reducedMotion) {
                render(target);
                return;
            }

            if (isGSAP) {
                render(0);

                HG.gsap.to({ value: 0 }, {
                    value: target,
                    duration: 1.4,
                    ease: "power2.out",
                    onUpdate() {
                        render(this.targets()[0].value);
                    },
                    scrollTrigger: HG.scrollTrigger ? {
                        trigger: counter,
                        start: "top 90%",
                        once: true
                    } : undefined
                });
            } else {
                render(target);
            }
        });
    }

    /* -----------------------------------------------------
       9. CARD AND BUTTON MICRO-INTERACTIONS
       ----------------------------------------------------- */

    function setupCardInteractions() {
        const cards = $$(
            ".project-card, .project-item, .experience-card, " +
            ".mission-card, .social-card, .contact-card, " +
            ".skill-card, .stat-card, .contact-channel, .card"
        );

        cards.forEach(card => {
            card.classList.add("hg-motion-card");

            if (!isGSAP || HG.mobile.matches) return;

            card.addEventListener("mouseenter", () => {
                HG.gsap.to(card, {
                    y: -4,
                    duration: 0.22,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            card.addEventListener("mouseleave", () => {
                HG.gsap.to(card, {
                    y: 0,
                    duration: 0.28,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        });

        const buttons = $$(
            ".btn, .button, button, .contact-cta a"
        );

        buttons.forEach(button => {
            button.classList.add("hg-motion-button");
        });
    }

    /* -----------------------------------------------------
       9A. MORPHGLASS POINTER HIGHLIGHT
       No animation loop; CSS owns the rendering.
       ----------------------------------------------------- */

    function setupMorphGlass() {
        const surfaces = $$(".hg-morph-glass");

        if (
            surfaces.length === 0 ||
            HG.reducedMotion ||
            window.matchMedia("(pointer: coarse)").matches
        ) {
            return;
        }

        surfaces.forEach(surface => {
            const onPointerMove = event => {
                const rect = surface.getBoundingClientRect();

                if (rect.width <= 0 || rect.height <= 0) return;

                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                surface.style.setProperty(
                    "--hg-mg-pointer-x",
                    `${Math.min(100, Math.max(0, x))}%`
                );
                surface.style.setProperty(
                    "--hg-mg-pointer-y",
                    `${Math.min(100, Math.max(0, y))}%`
                );
            };

            const onPointerLeave = () => {
                surface.style.removeProperty("--hg-mg-pointer-x");
                surface.style.removeProperty("--hg-mg-pointer-y");
            };

            surface.addEventListener("pointermove", onPointerMove, { passive: true });
            surface.addEventListener("pointerleave", onPointerLeave, { passive: true });
        });
    }

    /* -----------------------------------------------------
       10. PAGE TRANSITIONS
       ----------------------------------------------------- */

    function setupPageTransitions() {
        const overlay = document.createElement("div");

        overlay.className = "hg-transition-overlay";
        overlay.setAttribute("aria-hidden", "true");
        document.body.appendChild(overlay);

        document.addEventListener("click", event => {
            const link = event.target.closest("a[href]");

            if (!link) return;

            if (
                HG.reducedMotion ||
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            if (
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                link.hasAttribute("data-no-transition")
            ) {
                return;
            }

            let destination;

            try {
                destination = new URL(link.href, location.href);
            } catch {
                return;
            }

            if (
                destination.origin !== location.origin ||
                destination.pathname === location.pathname &&
                destination.search === location.search &&
                destination.hash
            ) {
                return;
            }

            if (
                destination.pathname === location.pathname &&
                destination.search === location.search
            ) {
                return;
            }

            event.preventDefault();

            overlay.classList.add("hg-transition-active");

            window.setTimeout(() => {
                location.href = destination.href;
            }, 180);
        });
    }

    /* -----------------------------------------------------
       11. ERROR-PAGE DETAILS
       ----------------------------------------------------- */

    function setupErrorPages() {
        const errorCode = $(".error-code");

        if (errorCode && isGSAP) {
            HG.gsap.from(errorCode, {
                scale: 0.9,
                opacity: 0,
                duration: 0.75,
                ease: "back.out(1.5)",
                clearProps: "all"
            });
        }

        // Videos should remain usable if autoplay is blocked.
        $$("video").forEach(video => {
            video.playsInline = true;

            if (HG.reducedMotion) {
                video.autoplay = false;
                video.removeAttribute("autoplay");
                video.pause();
            }
        });
    }


    /* -----------------------------------------------------
       12. OPTIONAL COLOR-VISION / DISPLAY SUPPORT
       Presentation preferences only; never a diagnosis.
       ----------------------------------------------------- */

    function setupCvdAdaptation() {
        if (document.getElementById("hg-cvd-launcher")) return;

        const storageKey = "hg-cvd-display-preferences-v1";
        const profiles = [
            { id: "p00", name: "Accessible Default", note: "Baseline support: status meaning stays available through words, shapes, and structure." },
            { id: "p01", name: "Protanomaly Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a protanomaly correction." },
            { id: "p02", name: "Protanopia Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a protanopia correction." },
            { id: "p03", name: "Deuteranomaly Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a deuteranomaly correction." },
            { id: "p04", name: "Deuteranopia Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a deuteranopia correction." },
            { id: "p05", name: "Tritanomaly Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a tritanomaly correction." },
            { id: "p06", name: "Tritanopia Assist", note: "Uses the common non-color support layer. The name is a preference label, not a diagnosis or a tritanopia correction." },
            { id: "p07", name: "Simplified Surfaces", note: "Removes selected decorative gradients and shadows while preserving semantic text and status labels." },
            { id: "p08", name: "High-Distinction UI", note: "Strengthens component boundaries and link distinction without applying a global color filter." },
            { id: "p09", name: "Personal Calibration", note: "Combine the manual display controls below to suit your own viewing preference." }
        ];

        const defaults = {
            profile: "p00",
            strength: "balanced",
            boundaries: false,
            neutralSurfaces: false
        };

        let preferences = { ...defaults };

        try {
            const stored = JSON.parse(window.localStorage.getItem(storageKey) || "null");
            if (stored && typeof stored === "object") {
                if (profiles.some(profile => profile.id === stored.profile)) preferences.profile = stored.profile;
                if (["subtle", "balanced", "stronger"].includes(stored.strength)) preferences.strength = stored.strength;
                preferences.boundaries = stored.boundaries === true;
                preferences.neutralSurfaces = stored.neutralSurfaces === true;
            }
        } catch {
            // Private browsing or disabled storage: use the accessible default.
        }

        const launcher = document.createElement("button");
        launcher.type = "button";
        launcher.id = "hg-cvd-launcher";
        launcher.className = "hg-cvd-launcher";
        launcher.setAttribute("aria-haspopup", "dialog");
        launcher.setAttribute("aria-controls", "hg-cvd-dialog");
        launcher.innerHTML = '<span class="hg-cvd-launcher-icon" aria-hidden="true">Aa</span><span>Display support</span>';

        const dialog = document.createElement("dialog");
        dialog.id = "hg-cvd-dialog";
        dialog.className = "hg-cvd-dialog";
        dialog.setAttribute("aria-labelledby", "hg-cvd-title");
        dialog.setAttribute("aria-describedby", "hg-cvd-description");
        const options = profiles.map(profile =>
            '<option value="' + profile.id + '">' + profile.id.toUpperCase() + ' — ' + profile.name + '</option>'
        ).join("");
        dialog.innerHTML =
            '<div class="hg-cvd-dialog-header">' +
                '<div><p class="hg-cvd-eyebrow">ACCESSIBILITY SETTINGS</p><h2 id="hg-cvd-title">Color &amp; display support</h2></div>' +
                '<button class="hg-cvd-close" id="hg-cvd-close" type="button" aria-label="Close display support settings">×</button>' +
            '</div>' +
            '<p class="hg-cvd-description" id="hg-cvd-description">Choose an optional presentation preference. These profiles are not medical diagnoses and do not apply a simulated color-vision filter.</p>' +
            '<div class="hg-cvd-field"><label for="hg-cvd-profile">Display profile</label><select id="hg-cvd-profile" name="profile">' + options + '</select><p class="hg-cvd-hint" id="hg-cvd-profile-note"></p></div>' +
            '<div class="hg-cvd-field"><label for="hg-cvd-strength">Support emphasis</label><select id="hg-cvd-strength" name="strength"><option value="subtle">Subtle</option><option value="balanced">Balanced</option><option value="stronger">Stronger</option></select><p class="hg-cvd-hint">This changes visual emphasis only, not medical severity.</p></div>' +
            '<fieldset class="hg-cvd-options"><legend>Personal calibration</legend>' +
                '<label class="hg-cvd-check"><input id="hg-cvd-boundaries" type="checkbox" aria-describedby=\"hg-cvd-control-hint\"><span>Emphasize component boundaries</span><span class=\"hg-cvd-lock-status\">Automatic</span></label>' +
                '<label class="hg-cvd-check"><input id="hg-cvd-neutral-surfaces" type="checkbox" aria-describedby=\"hg-cvd-control-hint\"><span>Remove decorative gradients and shadows on selected surfaces</span><span class=\"hg-cvd-lock-status\">Automatic</span></label>' +
                '<p class="hg-cvd-hint" id=\"hg-cvd-control-hint\">Some profiles apply these settings automatically. Select P00 or P09 to adjust a locked setting manually.</p>' +
            '</fieldset>' +
            '<p class="hg-cvd-privacy">Your preference is stored locally in this browser only. It is not sent to HyperGaruda. Images and videos are not recolored.</p>' +
            '<div class="hg-cvd-dialog-footer"><button class="hg-cvd-reset" id="hg-cvd-reset" type="button">Reset preferences</button><button class="hg-cvd-done" id="hg-cvd-done" type="button">Apply &amp; close</button></div>' +
            '<p class="hg-cvd-live" id="hg-cvd-live" role="status" aria-live="polite"></p>';

        document.body.append(launcher, dialog);

        const profileSelect = dialog.querySelector("#hg-cvd-profile");
        const strengthSelect = dialog.querySelector("#hg-cvd-strength");
        const boundariesToggle = dialog.querySelector("#hg-cvd-boundaries");
        const neutralToggle = dialog.querySelector("#hg-cvd-neutral-surfaces");
        const profileNote = dialog.querySelector("#hg-cvd-profile-note");
        const liveRegion = dialog.querySelector("#hg-cvd-live");

        function savePreferences() {
            try {
                window.localStorage.setItem(storageKey, JSON.stringify(preferences));
            } catch {
                // The controls remain active for this page if storage is unavailable.
            }
        }

        function applyPreferences() {
            const root = document.documentElement;
            const profile = profiles.find(item => item.id === preferences.profile) || profiles[0];

            const boundariesLocked = preferences.profile === "p08" || /^p0[1-6]$/.test(preferences.profile);
            const neutralSurfacesLocked = preferences.profile === "p07";
            const effectiveBoundaries = preferences.boundaries || boundariesLocked;
            const effectiveNeutralSurfaces = preferences.neutralSurfaces || neutralSurfacesLocked;

            root.dataset.hgCvdProfile = preferences.profile;
            root.dataset.hgCvdStrength = preferences.strength;
            root.dataset.hgCvdBoundaries = String(effectiveBoundaries);
            root.dataset.hgCvdNeutralSurfaces = String(effectiveNeutralSurfaces);

            profileSelect.value = preferences.profile;
            strengthSelect.value = preferences.strength;
            boundariesToggle.checked = effectiveBoundaries;
            boundariesToggle.disabled = boundariesLocked;
            boundariesToggle.closest(".hg-cvd-check").classList.toggle("hg-cvd-check-locked", boundariesLocked);
            neutralToggle.checked = effectiveNeutralSurfaces;
            neutralToggle.disabled = neutralSurfacesLocked;
            neutralToggle.closest(".hg-cvd-check").classList.toggle("hg-cvd-check-locked", neutralSurfacesLocked);
            profileNote.textContent = profile.note;

            document.querySelectorAll(".status-dot").forEach(dot => dot.setAttribute("aria-hidden", "true"));
            document.querySelectorAll(".response-speed, .project-status, .social-status").forEach(status => {
                status.setAttribute("data-cvd-text-status", "true");
            });
        }

        function announceChange() {
            const profile = profiles.find(item => item.id === preferences.profile) || profiles[0];
            liveRegion.textContent = profile.name + " selected. Support emphasis: " + preferences.strength + ".";
        }

        function updateFromControls() {
            preferences.profile = profileSelect.value;
            preferences.strength = strengthSelect.value;
            if (!boundariesToggle.disabled) preferences.boundaries = boundariesToggle.checked;
            if (!neutralToggle.disabled) preferences.neutralSurfaces = neutralToggle.checked;
            applyPreferences();
            savePreferences();
            announceChange();
        }

        function closeDialog() {
            if (typeof dialog.close === "function" && dialog.open) {
                dialog.close();
            } else {
                dialog.removeAttribute("open");
                launcher.focus();
            }
        }

        profileSelect.addEventListener("change", updateFromControls);
        strengthSelect.addEventListener("change", updateFromControls);
        boundariesToggle.addEventListener("change", updateFromControls);
        neutralToggle.addEventListener("change", updateFromControls);

        dialog.querySelector("#hg-cvd-close").addEventListener("click", closeDialog);
        dialog.querySelector("#hg-cvd-done").addEventListener("click", closeDialog);
        dialog.querySelector("#hg-cvd-reset").addEventListener("click", () => {
            preferences = { ...defaults };
            applyPreferences();
            savePreferences();
            liveRegion.textContent = "Display preferences reset to Accessible Default.";
            profileSelect.focus();
        });

        launcher.addEventListener("click", () => {
            if (typeof dialog.showModal === "function") {
                if (!dialog.open) dialog.showModal();
            } else {
                dialog.setAttribute("open", "");
                dialog.setAttribute("role", "dialog");
                dialog.setAttribute("aria-modal", "false");
            }
            profileSelect.focus();
        });

        dialog.addEventListener("click", event => {
            if (event.target === dialog) closeDialog();
        });
        dialog.addEventListener("close", () => launcher.focus());

        applyPreferences();
    }

});


(async () => {
  const link = document.getElementById("dynamic-hub-link");
  if (!link) return;

  try {
    const response = await fetch("/api/system.json", {
      cache: "no-store",
    });

    if (!response.ok) return;

    const system = await response.json();
    const companionUrl = system.companionUrl;

    if (!companionUrl) return;

    const target = new URL(companionUrl);

    if (target.protocol !== "https:" && target.protocol !== "http:") {
      return;
    }

    link.href = target.href;
    link.removeAttribute("aria-current");
    link.classList.remove("hg-current-link");
    link.hidden = false;
  } catch (error) {
    console.error("Dynamic Hub connection unavailable:", error);
  }
})();
