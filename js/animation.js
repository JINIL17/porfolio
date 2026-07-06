/* ==========================================================================
   ETHAN COLE — PORTFOLIO
   animation.js
   Handles: loading screen, AOS init, GSAP scroll animations, custom cursor,
   card tilt effect, particle background, ripple buttons, parallax.
   ========================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     1. LOADING SCREEN
     Simulates a short "boot sequence" then fades the loader out.
  --------------------------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    const statusEl = document.getElementById("loaderStatus");
    if (!loader) return;

    const messages = ["booting system...", "compiling assets...", "waking up the server...", "almost there..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      if (statusEl) statusEl.textContent = messages[i];
    }, 500);

    window.addEventListener("load", () => {
      setTimeout(() => {
        clearInterval(interval);
        loader.classList.add("loaded");
        document.body.style.overflow = "";
        // Kick off hero entrance animation once loader is gone
        animateHeroEntrance();
      }, 900);
    });
  }

  /* ---------------------------------------------------------------------
     2. AOS INIT
  --------------------------------------------------------------------- */
  function initAOS() {
    if (typeof AOS === "undefined") return;
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: prefersReducedMotion,
    });
  }

  /* ---------------------------------------------------------------------
     2b. SPLIT-TEXT PREP (SplitType)
     Wraps the hero role line and every section title into per-word spans
     so they can be revealed one word at a time instead of as a flat block.
     Runs early (before the hero entrance plays) so the initial "hidden"
     state is set before anything becomes visible — avoids a flash of
     unstyled full-strength text.
  --------------------------------------------------------------------- */
  function initSplitText() {
    if (typeof SplitType === "undefined" || typeof gsap === "undefined" || prefersReducedMotion) return;

    const roleEl = document.querySelector(".hero-role");
    if (roleEl) {
      const roleSplit = new SplitType(roleEl, { types: "words" });
      gsap.set(roleSplit.words, { opacity: 0, y: 20 });
      window.__heroRoleWords = roleSplit.words;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll(".section-title").forEach((el) => {
        const split = new SplitType(el, { types: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }
  }

  /* ---------------------------------------------------------------------
     3. GSAP HERO ENTRANCE + SCROLL ANIMATIONS
  --------------------------------------------------------------------- */
  function animateHeroEntrance() {
    if (typeof gsap === "undefined" || prefersReducedMotion) return;

    gsap.fromTo(
      ".hero-name",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );

    // Reveal the role line word-by-word if SplitType prepared it; otherwise
    // fall back to a plain fade so the line still appears if the CDN script
    // failed to load.
    if (window.__heroRoleWords && window.__heroRoleWords.length) {
      gsap.to(window.__heroRoleWords, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.2,
        ease: "power3.out",
      });
    } else {
      gsap.fromTo(
        ".hero-role",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out" }
      );
    }

    gsap.fromTo(
      "#consoleCard",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
    );
  }

  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on hero grid background
    gsap.to(".hero-grid-bg", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Section titles are now handled by the word-stagger reveal in
    // initSplitText() — see above.

    // Floating ambient motion for console card
    gsap.to("#consoleCard", {
      y: -10,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2,
    });

    // Scroll-triggered 3D section reveals — each section settles into place
    // with a subtle rotateX tilt as it enters the viewport. This runs on the
    // section itself (no opacity change) so it layers on top of, rather than
    // fights with, the per-element AOS fades already happening inside each
    // section. #main establishes the shared perspective in style.css so the
    // tilt actually reads as 3D instead of a flat skew.
    document.querySelectorAll("main > .section-pad").forEach((section) => {
      gsap.fromTo(
        section,
        { rotateX: 5, y: 50, transformOrigin: "top center" },
        {
          rotateX: 0,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  /* ---------------------------------------------------------------------
     4. CUSTOM CURSOR
  --------------------------------------------------------------------- */
  function initCustomCursor() {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring || window.matchMedia("(max-width: 991.98px)").matches) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function loop() {
      // Smoothly ease the ring toward the pointer for a trailing feel
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverTargets = "a, button, .tilt-card, input, textarea, .stack-tab";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.add("hovering");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) ring.classList.remove("hovering");
    });
  }

  /* ---------------------------------------------------------------------
     5. CARD TILT EFFECT (3D hover tilt on project + console cards)
  --------------------------------------------------------------------- */
  function initTiltEffect() {
    if (prefersReducedMotion || window.matchMedia("(max-width: 767.98px)").matches) return;
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach((card) => {
      // Target rotation follows the cursor instantly; current rotation eases
      // toward it every frame, so the card settles smoothly instead of
      // snapping — this reads much more like a physical object with weight.
      let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
      let hovering = false;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        targetX = ((y - centerY) / centerY) * -8;
        targetY = ((x - centerX) / centerX) * 8;
        hovering = true;
      });
      card.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
        hovering = false;
      });

      function raf() {
        currentX += (targetX - currentX) * 0.09;
        currentY += (targetY - currentY) * 0.09;
        const lift = hovering ? -10 : 0;
        card.style.transform = `perspective(800px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(${lift}px)`;
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });
  }

  /* ---------------------------------------------------------------------
     6. RIPPLE BUTTON EFFECT
  --------------------------------------------------------------------- */
  function initRippleButtons() {
    const buttons = document.querySelectorAll(".btn-glow, .btn-outline-console, .btn-console");
    buttons.forEach((btn) => {
      btn.style.position = btn.style.position || "relative";
      btn.style.overflow = "hidden";
      btn.addEventListener("click", function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple-span";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------------------------------------------------------------------
     7. LIGHTWEIGHT PARTICLE BACKGROUND (Canvas, no external dependency)
     Drawn on #particlesCanvas within the hero section — small drifting
     nodes connected by faint lines, evoking a "network/system" feel.
     This is the FALLBACK path — initHeroBackground() below tries the
     Three.js WebGL version first and only calls this if that's unavailable
     or unsuitable for the current device.
  --------------------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");
    const hero = document.getElementById("hero");
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(60, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const dotColor = isLight ? "rgba(124,92,255,0.5)" : "rgba(34,211,238,0.55)";
      const lineColor = isLight ? "rgba(124,92,255,0.12)" : "rgba(124,92,255,0.14)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    resize();
    createParticles();
    step();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
  }

  /* ---------------------------------------------------------------------
     7a. WEBGL PARTICLE FIELD (Three.js) — the "maximized" hero background.
     Real depth: points sit at varying Z, drift slowly, and parallax with
     the cursor. Deliberately gated off on small phones and reduced-motion
     so it never becomes the thing that makes the site feel slow — the 2D
     canvas above is always there to catch it if this can't run.
     Returns true if it actually started, so the caller knows whether it
     still needs the 2D fallback.
  --------------------------------------------------------------------- */
  function initThreeParticles() {
    if (typeof THREE === "undefined" || prefersReducedMotion) return false;
    if (window.matchMedia("(max-width: 575.98px)").matches) return false;

    const hero = document.getElementById("hero");
    const mount = document.getElementById("heroWebGL");
    if (!hero || !mount) return false;

    let width = hero.offsetWidth;
    let height = hero.offsetHeight;
    if (!width || !height) return false;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (err) {
      return false; // WebGL unsupported/blocked — let the 2D canvas handle it
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 600;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Point cloud: colored between the site's violet and cyan accents,
    // spread across a real 3D volume so depth is visible, not just implied.
    const count = 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x22d3ee);
    const violet = new THREE.Color(0x7c5cff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 700;

      const mixed = cyan.clone().lerp(violet, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Faint connecting lines between nearby-in-index points — echoes the
    // "network" feel of the 2D fallback, now with real depth behind it.
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7c5cff,
      transparent: true,
      opacity: 0.12,
    });
    const linePositions = [];
    for (let i = 0; i < count; i += 4) {
      const j = (i + 1 + Math.floor(Math.random() * 5)) % count;
      linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Cursor-driven parallax: rotation target follows the mouse, eased in
    // every frame (same lerp approach as the card tilt) so it settles
    // smoothly instead of snapping.
    let targetRotY = 0;
    let targetRotX = 0;
    window.addEventListener("mousemove", (e) => {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.2;
    });

    let rafId;
    function animate() {
      points.rotation.y += (targetRotY - points.rotation.y) * 0.02 + 0.0005;
      points.rotation.x += (targetRotX - points.rotation.x) * 0.02;
      lines.rotation.copy(points.rotation);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    return true;
  }

  /* ---------------------------------------------------------------------
     7b. HERO BACKGROUND DISPATCHER
     Tries the WebGL version first; only falls back to the lightweight 2D
     canvas if Three.js isn't available, WebGL is unsupported, the screen
     is a small phone, or reduced-motion is set.
  --------------------------------------------------------------------- */
  function initHeroBackground() {
    const usedWebGL = initThreeParticles();
    if (!usedWebGL) initParticles();
  }

  /* ---------------------------------------------------------------------
     7c. LENIS SMOOTH SCROLL
     Replaces native scroll physics with an inertia-based smooth scroll,
     kept in sync with GSAP's ScrollTrigger (which drives the section-reveal
     and parallax animations) so scroll-linked animations stay accurate.
     Also takes over in-page anchor links (nav, hero CTAs, scroll cue, back-
     to-top) so anchor jumps share the same smooth motion instead of
     snapping via the browser's native behavior.
  --------------------------------------------------------------------- */
  function initSmoothScroll() {
    if (typeof Lenis === "undefined" || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", () => {
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.length <= 1) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      });
    });

    // Exposed so script.js's back-to-top button can reuse the same
    // smooth-scroll instance instead of falling back to native scrolling.
    window.PortfolioLenis = lenis;
  }

  /* ---------------------------------------------------------------------
     INIT
  --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initAOS();
    initSplitText();
    initScrollAnimations();
    initSmoothScroll();
    initCustomCursor();
    initTiltEffect();
    initRippleButtons();
    initHeroBackground();
  });

  // Expose a couple of helpers for script.js to reuse if needed
  window.PortfolioAnimation = { initTiltEffect };
})();