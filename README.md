# Ethan Cole — Portfolio

A premium, dark-themed developer portfolio built with semantic HTML5, hand-written CSS3
(no framework overrides beyond Bootstrap's grid/utilities), and vanilla JavaScript —
enhanced with AOS, GSAP, and Typed.js.

## Design concept: "Systems Console"

The visual identity is built around the idea of a live systems dashboard — grounded in
the kind of work the portfolio showcases (booking engines, POS systems, monitoring
dashboards). The hero's signature element is a glass "console card" with animated
metrics and an uptime bar; navigation, labels, and data points use JetBrains Mono to
reinforce that console feel, while Sora (display) and Inter (body) keep the reading
experience clean.

- **Palette:** near-black navy background, violet → cyan gradient accent, glass surfaces.
- **Type:** Sora (headings), Inter (body), JetBrains Mono (labels, eyebrows, data).
- **Signature element:** the hero "console card" — live counters, uptime bar, typed
  terminal line.

## Folder structure

```
portfolio/
│── index.html
│── css/
│     style.css        → design tokens, layout, components (light + dark theme)
│     animations.css   → all @keyframes + motion-only utility classes
│     responsive.css   → tablet/mobile breakpoints
│── js/
│     script.js        → nav, theme toggle, typed effect, counters, filters,
│                         radar chart, testimonials, form validation, toasts
│     animation.js      → loader, AOS/GSAP setup, custom cursor, tilt effect,
│                         ripple buttons, canvas particle background
│── assets/
│     images/           → add real photos/screenshots here
│     icons/             → add any custom icon assets here
│── resume/
│     resume.pdf         → add your real resume here (see placeholder note)
```

## Customizing content

Everything is in `index.html` as plain markup — no build step, no templating engine.
Search for these anchors to update quickly:

- **Name / role / summary** — `#hero`
- **Photo** — swap the `dicebear` placeholder `<img src>` URLs for real photos in
  `assets/images/` (update the `src` attribute accordingly)
- **Skills & progress bars** — `#stack`, edit `--pct` inline style per `.skill-bar span`
- **Projects** — `#projects`, duplicate a `.project-item` block; `data-cat` drives the
  filter buttons and `data-name` drives search
- **Experience** — `#experience`, duplicate a `.timeline-item`
- **Contact links / form endpoint** — `#contact`; the form currently simulates a send in
  `initContactForm()` inside `script.js` — replace the `setTimeout` block with a real
  `fetch()` call to your backend or a service like Formspree/EmailJS

## Features implemented

- Loading screen with simulated boot sequence
- Scroll progress indicator + custom cursor (desktop only)
- Sticky navbar with scroll-based active-section highlighting
- Light/dark theme toggle, persisted via `localStorage`
- Typed.js rotating skill line
- Animated counters + skill progress bars (IntersectionObserver-driven)
- Canvas-based particle background (no external particle library needed)
- Canvas-based skills radar chart (no chart library needed)
- Tilt (3D hover) effect on cards, ripple effect on buttons
- Filterable + searchable project grid
- Testimonial carousel
- Contact form with client-side validation + toast notifications
- Back-to-top button, custom scrollbar
- Fully responsive: desktop, tablet, mobile
- `prefers-reduced-motion` respected; visible keyboard focus states throughout

## Running locally

No build tools required. Either open `index.html` directly in a browser, or serve the
folder locally (recommended, so relative asset paths behave exactly like production):

```bash
cd portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Notes

- All third-party libraries (Bootstrap, AOS, GSAP, Typed.js, Font Awesome) are loaded via
  CDN in `index.html`. For an offline build, download each into a `vendor/` folder and
  update the `<link>`/`<script>` paths.
- Placeholder photos use DiceBear (avatars) and Unsplash (project thumbnails) — replace
  with real assets before publishing.
