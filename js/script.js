/* ==========================================================================
   ETHAN COLE — PORTFOLIO
   script.js
   Handles: navbar behavior, theme toggle + persistence, typed effect,
   scroll progress, back-to-top, animated counters, skill bar fills,
   stack/project filtering + search, radar chart, testimonial carousel,
   contact form validation, and toast notifications.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     0. CONSOLE EASTER EGG — a small nod to any fellow dev who pops open
     devtools on a developer portfolio, which happens more than you'd think.
  --------------------------------------------------------------------- */
  function printConsoleGreeting() {
    console.log(
      "%c👋 Hey, fellow developer.",
      "font-family: monospace; font-size: 16px; font-weight: bold; color: #22d3ee;"
    );
    console.log(
      "%cYou're the kind of person who checks the console — I respect that.\nIf you're hiring, or just want to talk shop: hello@jenielsabalboro.dev",
      "font-family: monospace; font-size: 12px; color: #7c5cff; line-height: 1.6;"
    );
  }

  /* ---------------------------------------------------------------------
     1. NAVBAR: scroll shadow + active section highlighting + mobile close
  --------------------------------------------------------------------- */
  function initNavbar() {
    const nav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll(".nav-link[data-nav]");
    const sections = Array.from(navLinks)
      .map((link) => document.getElementById(link.dataset.nav))
      .filter(Boolean);

    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 30);

      let currentId = null;
      const scrollPos = window.scrollY + 140;
      sections.forEach((sec) => {
        if (sec.offsetTop <= scrollPos) currentId = sec.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("active-link", link.dataset.nav === currentId);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Close the mobile menu after a link is tapped
    const collapseEl = document.getElementById("navMenu");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (collapseEl.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(collapseEl).hide();
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     2. THEME TOGGLE (persisted via localStorage)
  --------------------------------------------------------------------- */
  function initThemeToggle() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById("themeToggle");
    const saved = localStorage.getItem("ec-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    const initial = saved || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initial);
    toggleBtn.setAttribute("aria-pressed", String(initial === "light"));

    toggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("ec-theme", next);
      toggleBtn.setAttribute("aria-pressed", String(next === "light"));
      showToast(`${next === "light" ? "Light" : "Dark"} mode enabled`, "info");
    });
  }

  /* ---------------------------------------------------------------------
     3. TYPED.JS — rotating skill/role line in the hero
  --------------------------------------------------------------------- */
  function initTyped() {
    const target = document.getElementById("typedSkills");
    if (!target || typeof Typed === "undefined") return;

    // Hide the manual caret since Typed.js renders its own
    const manualCaret = document.querySelector(".typed-caret");
    if (manualCaret) manualCaret.style.display = "none";

    new Typed("#typedSkills", {
      strings: [
        "building PHP MVC platforms.",
        "designing MySQL schemas that scale.",
        "shipping real-time dashboards.",
        "fixing bugs before users notice them.",
        "turning spreadsheets into systems.",
      ],
      typeSpeed: 42,
      backSpeed: 22,
      backDelay: 1400,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  /* ---------------------------------------------------------------------
     4. SCROLL PROGRESS BAR
  --------------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgressBar");
    if (!bar) return;
    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
     5. BACK TO TOP BUTTON
  --------------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("visible", window.scrollY > 500),
      { passive: true }
    );
    btn.addEventListener("click", () => {
      // Prefer the Lenis instance (animation.js) so this shares the same
      // smooth-scroll feel as the rest of the page; fall back to native
      // smooth scrolling if Lenis didn't load.
      if (window.PortfolioLenis) {
        window.PortfolioLenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ---------------------------------------------------------------------
     6. ANIMATED COUNTERS (hero console metrics) — runs once, on view
  --------------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
          el.classList.add("pop");
        }
      }
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ---------------------------------------------------------------------
     7. SKILL PROGRESS BARS — fill in when scrolled into view
  --------------------------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll(".skill-bar span");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("filled");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------------------------------------------------------------
     8. TECH STACK FILTER TABS
  --------------------------------------------------------------------- */
  function initStackFilters() {
    const tabs = document.querySelectorAll(".stack-tab[data-filter]");
    const items = document.querySelectorAll(".skill-item");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.dataset.filter;

        items.forEach((item) => {
          const match = filter === "all" || item.dataset.cat === filter;
          item.classList.toggle("hidden-item", !match);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     9. PROJECT FILTER + SEARCH
  --------------------------------------------------------------------- */
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll(".stack-tab[data-project-filter]");
    const searchInput = document.getElementById("projectSearch");
    const items = document.querySelectorAll(".project-item");
    const noResults = document.getElementById("noResultsMsg");
    let activeFilter = "all";

    function applyFilters() {
      const query = (searchInput?.value || "").trim().toLowerCase();
      let visibleCount = 0;

      items.forEach((item) => {
        const matchesFilter = activeFilter === "all" || item.dataset.cat === activeFilter;
        const matchesSearch = !query || item.dataset.name.includes(query);
        const show = matchesFilter && matchesSearch;
        item.classList.toggle("hidden-item", !show);
        if (show) visibleCount++;
      });

      if (noResults) noResults.classList.toggle("d-none", visibleCount !== 0);
    }

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.projectFilter;
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
  }

  /* ---------------------------------------------------------------------
     9b. PROJECT CARD 3D FLIP — click/tap or Enter/Space to flip each card
     between its front (thumbnail) and back (description, tags, links).
     Works identically on touch and desktop since it's click-driven rather
     than hover-only.
  --------------------------------------------------------------------- */
  function initProjectFlip() {
    const cards = document.querySelectorAll(".project-card-flip");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        // Let real links on the back face navigate instead of just flipping back
        if (e.target.closest("a")) return;
        card.classList.toggle("flipped");
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("flipped");
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     10. SKILLS RADAR CHART — lightweight canvas render, no chart library
  --------------------------------------------------------------------- */
  function initRadarChart() {
    const canvas = document.getElementById("radarChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const data = [
      { label: "Frontend", value: 0.88 },
      { label: "Backend", value: 0.92 },
      { label: "Database", value: 0.85 },
      { label: "DevOps", value: 0.62 },
      { label: "UI/UX", value: 0.72 },
      { label: "Problem Solving", value: 0.95 },
    ];

    function getThemeColors() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      return {
        grid: isLight ? "rgba(10,14,23,0.12)" : "rgba(255,255,255,0.1)",
        label: isLight ? "#454b5c" : "#b7bfd1",
        fill: "rgba(124,92,255,0.28)",
        stroke: "#22d3ee",
        dot: "#7c5cff",
      };
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 60;
      const sides = data.length;
      const colors = getThemeColors();

      ctx.clearRect(0, 0, w, h);

      // Grid rings
      const rings = 4;
      for (let r = 1; r <= rings; r++) {
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
          const rr = (radius * r) / rings;
          const x = cx + rr * Math.cos(angle);
          const y = cy + rr * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Axis lines + labels
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = colors.label;
      data.forEach((point, i) => {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = colors.grid;
        ctx.stroke();

        const lx = cx + (radius + 28) * Math.cos(angle);
        const ly = cy + (radius + 28) * Math.sin(angle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(point.label, lx, ly);
      });

      // Data polygon
      ctx.beginPath();
      data.forEach((point, i) => {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const rr = radius * point.value;
        const x = cx + rr * Math.cos(angle);
        const y = cy + rr * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = colors.fill;
      ctx.fill();
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Data point dots
      data.forEach((point, i) => {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const rr = radius * point.value;
        const x = cx + rr * Math.cos(angle);
        const y = cy + rr * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.dot;
        ctx.fill();
      });
    }

    draw();
    // Redraw on theme change so colors stay legible
    document.getElementById("themeToggle")?.addEventListener("click", () => setTimeout(draw, 50));
    window.addEventListener("resize", draw);
  }

  /* ---------------------------------------------------------------------
     11. TESTIMONIAL CAROUSEL
  --------------------------------------------------------------------- */
  function initTestimonials() {
    const track = document.getElementById("testimonialTrack");
    if (!track) return;
    const slides = track.querySelectorAll(".testimonial-slide");
    const dotsWrap = document.getElementById("testimonialDots");
    const prevBtn = document.getElementById("testimonialPrev");
    const nextBtn = document.getElementById("testimonialNext");
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll("span");

    function goTo(i) {
      slides[index].classList.remove("active");
      dots[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("active");
      dots[index].classList.add("active");
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => goTo(index + 1), 6000);
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    resetTimer();
  }

  /* ---------------------------------------------------------------------
     12. CONTACT FORM VALIDATION + FAKE SUBMIT + TOAST
  --------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Destination address for the mailto fallback. Update this if your
    // real contact email changes — it's the only place it's defined.
    const CONTACT_EMAIL = "hello@jenielsabalboro.dev";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      const submitBtn = document.getElementById("contactSubmit");
      const label = submitBtn.querySelector(".btn-label");
      const originalText = label.textContent;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      submitBtn.disabled = true;
      label.textContent = "Opening email...";

      // No backend is wired up yet, so this builds a real mailto: link with
      // the form's contents pre-filled and hands it to the browser — the
      // person's own email client sends it, no server required. Once a real
      // backend/email API (e.g. Formspree, EmailJS) is available, replace
      // this block with an actual fetch() POST instead.
      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoLink =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(mailBody)}`;

      window.location.href = mailtoLink;

      setTimeout(() => {
        submitBtn.disabled = false;
        label.textContent = originalText;
        showToast("Your email app should be open now — hit send there to reach me.", "success");
      }, 700);
    });
  }

  /* ---------------------------------------------------------------------
     13. TOAST NOTIFICATIONS
  --------------------------------------------------------------------- */
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info",
    };
    const colors = { success: "#34d399", error: "#f87171", info: "#22d3ee" };

    const toastEl = document.createElement("div");
    toastEl.className = "toast align-items-center border-0 showing";
    toastEl.setAttribute("role", "alert");
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fa-solid ${icons[type]} me-2" style="color:${colors[type]}" aria-hidden="true"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    container.appendChild(toastEl);

    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }

  /* ---------------------------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------------------------- */
  function initFooterYear() {
    const el = document.getElementById("footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------------
     INIT — run everything once the DOM is ready
  --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    printConsoleGreeting();
    initNavbar();
    initThemeToggle();
    initTyped();
    initScrollProgress();
    initBackToTop();
    initCounters();
    initSkillBars();
    initStackFilters();
    initProjectFilters();
    initProjectFlip();
    initRadarChart();
    initTestimonials();
    initContactForm();
    initFooterYear();
  });

  // Expose showToast globally in case other scripts want it
  window.showToast = showToast;
})();