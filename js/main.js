/* Qevo — Management profile landing
 * Data-driven metric dashboards + GSAP/ScrollTrigger scroll animations.
 */

// ---------------------------------------------------------------------------
// Data (edit here). Chart values are relative daily impressions estimated from
// the X Analytics screenshots — only the shape is shown, no per-bar numbers.
// ---------------------------------------------------------------------------
const METRICS = {
  lol: {
    cards: [
      { label: "Verified followers", value: "115", of: "/ 6.6K", verified: true },
      { label: "Impressions", value: "195.4K", delta: "63%", dir: "up" },
      { label: "Engagement rate", value: "5.4%", delta: "21%", dir: "down" },
      { label: "Engagements", value: "10.5K", delta: "29%", dir: "up" },
      { label: "Profile visits", value: "4.1K", delta: "148%", dir: "up" },
      { label: "Replies", value: "163", delta: "27%", dir: "up" },
      { label: "Likes", value: "1.8K", delta: "31%", dir: "up" },
      { label: "Reposts", value: "173", delta: "47%", dir: "up" },
      { label: "Bookmarks", value: "29", delta: "25%", dir: "down" },
      { label: "Shares", value: "13", delta: "40%", dir: "down" },
    ],
    chart: [8, 19, 4, 2, 1, 6, 13, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 0.8, 0.6, 0.5, 0.5, 0.5, 0.6, 6, 13, 22, 8, 4, 23, 7, 1, 2, 1.5, 1, 1, 4],
    axis: ["", ""],
  },
  val: {
    cards: [
      { label: "Verified followers", value: "115", of: "/ 6.6K", verified: true },
      { label: "Impressions", value: "602.3K", delta: "2K%", dir: "up" },
      { label: "Engagement rate", value: "6%", delta: "87%", dir: "up" },
      { label: "Engagements", value: "36.2K", delta: "5K%", dir: "up" },
      { label: "Profile visits", value: "15.6K", delta: "11K%", dir: "up" },
      { label: "Replies", value: "245", delta: "1K%", dir: "up" },
      { label: "Likes", value: "6.2K", delta: "3K%", dir: "up" },
      { label: "Reposts", value: "283", delta: "1K%", dir: "up" },
      { label: "Bookmarks", value: "201", delta: "20K%", dir: "up" },
      { label: "Shares", value: "125", delta: "12K%", dir: "up" },
    ],
    chart: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 245, 35, 20, 7, 3, 3, 3, 5, 45, 35, 8, 48, 8, 3, 3, 7, 12, 9, 1, 1, 1, 18],
    axis: ["Jan 10", "Feb 9"],
  },
};

const VERIFIED_ICON =
  '<svg viewBox="0 0 24 24" aria-label="Verified"><path d="M22.5 12.5c0-1.6-.9-2.9-2.2-3.6.2-.5.2-1 .2-1.4 0-2.4-1.9-4.3-4.2-4.3-.5 0-1 .1-1.5.3C14.1 2.2 12.8 1.3 11.3 1.3S8.5 2.2 7.9 3.5c-.5-.2-1-.3-1.5-.3-2.4 0-4.2 1.9-4.2 4.3 0 .5.1 1 .2 1.4C1.1 9.6.2 11 .2 12.5s.9 2.9 2.2 3.6c-.1.5-.2.9-.2 1.4 0 2.4 1.9 4.3 4.2 4.3.5 0 1-.1 1.5-.3.6 1.3 1.9 2.2 3.4 2.2s2.8-.9 3.4-2.2c.5.2 1 .3 1.5.3 2.4 0 4.2-1.9 4.2-4.3 0-.5-.1-1-.2-1.4 1.3-.7 2.3-2 2.3-3.6zm-12.3 4.6L6.4 13.3l1.4-1.4 2.4 2.4 5.6-5.9 1.5 1.4-7.1 7.3z"/></svg>';

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Render dashboards (runs even without GSAP)
// ---------------------------------------------------------------------------
function parseValue(str) {
  const m = str.match(/^([\d.]+)(.*)$/);
  const num = parseFloat(m[1]);
  const dec = (m[1].split(".")[1] || "").length;
  return { num, dec, suffix: m[2] };
}

function renderDash(el) {
  const data = METRICS[el.dataset.dataset];
  const cards = data.cards
    .map((c) => {
      const delta = c.delta
        ? `<span class="card__delta ${c.dir}">${c.dir === "up" ? "↑" : "↓"} ${c.delta}</span>`
        : "";
      const of = c.of ? `<span class="card__of">${c.of}</span>` : "";
      return `<div class="card">
        <div class="card__label"><span>${c.label}</span>${c.verified ? VERIFIED_ICON : ""}</div>
        <div class="card__value"><span class="card__num" data-value="${c.value}">${c.value}</span>${of}${delta}</div>
      </div>`;
    })
    .join("");

  const max = Math.max(...data.chart);
  const bars = data.chart
    .map((v) => `<span class="chart__bar" style="height:${Math.max((v / max) * 100, 1.2)}%"></span>`)
    .join("");

  el.innerHTML = `
    <div class="cards">${cards}</div>
    <div class="chart" role="img" aria-label="Daily impressions bar chart">
      <div class="chart__head"><b>Impressions</b><span>Daily</span></div>
      <div class="chart__plot">${bars}</div>
      <div class="chart__axis"><span>${data.axis[0]}</span><span>${data.axis[1]}</span></div>
    </div>`;
}

document.querySelectorAll(".dash").forEach(renderDash);

// ---------------------------------------------------------------------------
// Talents carousel. `socials` maps platform → handle (order = render order).
// Images are 600×750 WebP in assets/talents/<id>.webp
// ---------------------------------------------------------------------------
const TALENTS = [
  { id: "agustinitita", name: "Agustinitita", tags: ["Gaming", "Cosplay", "IRL"], socials: { instagram: "aguslagarde", tiktok: "agustinitaclips", x: "agustinititaaa", twitch: "agustinitita" } },
  { id: "baki", name: "Baki", tags: ["Valorant"], socials: { instagram: "bakivlrt", tiktok: "bakivlrt", x: "BakiVlrt", twitch: "baki" } },
  { id: "evilcele", name: "EvilCele", tags: ["Gaming", "Moda", "IRL"], socials: { instagram: "evilcele", tiktok: "evilcele", twitch: "evilcele" } },
  { id: "renzzotv", name: "RenzzoTV", tags: ["Shooters", "Fitness"], socials: { instagram: "renzzotv", tiktok: "renzzotv", kick: "renzzotv" } },
  { id: "doni", name: "Doni", tags: ["League of Legends"], socials: { instagram: "donilool", youtube: "donilool7", tiktok: "donilool", twitch: "donilool", x: "donilool" } },
  { id: "moondays", name: "Moondays", tags: ["Cosplay", "Moda", "Gaming", "IRL"], socials: { instagram: "moondaysok", twitch: "moon_days", tiktok: "moondaysok", x: "MoonDaysok", youtube: "MoonDays" } },
  { id: "borkast", name: "Borkast", tags: ["Gaming", "Tech", "IRL"], socials: { tiktok: "borkast", instagram: "borkast_", youtube: "Borkast1" } },
  { id: "niriiv", name: "Niriiv", tags: ["Gaming", "Fitness"], socials: { tiktok: "niriiv", instagram: "niriiv", youtube: "NiRiiV" } },
  { id: "daarknz", name: "Daarknz", tags: ["FPS"], socials: { tiktok: "daarknzz", instagram: "darknzblood", kick: "daarknz" } },
  { id: "biceps", name: "Biceps", tags: ["FPS", "Fitness"], socials: { tiktok: "bicepsoficial", youtube: "bicepsoficial", instagram: "bicepsoficial", kick: "biceps" } },
  { id: "mac", name: "Mac de Mac", tags: ["League of Legends", "Lifestyle"], socials: { instagram: "rociobbarcia", tiktok: "macdetwitch", twitch: "macdemac", kick: "macdemac", x: "macdemacs" } },
  { id: "creador", name: "Creador", tags: ["Gaming", "Tech", "Lifestyle", "DJ"], socials: { tiktok: "creador150", instagram: "creador150", twitch: "creador", x: "Creador150" } },
  { id: "nano", name: "Nano", tags: ["Gaming", "IRL"], socials: { instagram: "marianoniccolas", youtube: "Nanocs1", kick: "nano", x: "marianoniccolas", tiktok: "nanocs1.twitch" } },
  { id: "angelysaras", name: "Angel y Saras", tags: ["Gaming", "Fitness"], socials: { youtube: "angelysaras", twitch: "angelysaras", instagram: "angelysara", x: "AngelySaras", tiktok: "angelysaras89" } },
  { id: "kadnita", name: "KADnita", tags: ["Valorant", "Moda"], socials: { twitch: "kadnita", instagram: "camidambrosio", tiktok: "kadnita", x: "_CamilaDam_" } },
  { id: "borraskka", name: "Borraskka", tags: ["Gaming", "Shooters"], socials: { twitch: "borraskka", youtube: "borraskka", instagram: "borraskka", x: "borraskkaaa", tiktok: "borraskkatwitch" } },
  { id: "tempofps", name: "TempoFPS", tags: ["CODMobile Pro"], socials: { kick: "tempoofps", instagram: "tempoofps", tiktok: "tempofps" } },
];

const SOCIALS = {
  youtube: { label: "YouTube", url: (h) => `https://www.youtube.com/@${h}`, path: "M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" },
  instagram: { label: "Instagram", url: (h) => `https://www.instagram.com/${h}/`, path: "M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.3 5.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 2c-2.7 0-3 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C3.9 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z" },
  twitch: { label: "Twitch", url: (h) => `https://www.twitch.tv/${h}`, path: "M4.3 2L3 5.4v13.7h4.7V22h2.6l2.8-2.9h3.8L22 14V2H4.3zm15.8 11.1l-2.9 3h-4.6l-2.6 2.6v-2.6H6.1V3.9h14v9.2zM17.2 7.2h-1.9v5.5h1.9V7.2zm-5.1 0h-1.9v5.5h1.9V7.2z" },
  kick: { label: "Kick", url: (h) => `https://kick.com/${h}`, path: "M3 3h6v5h2V6h2V4h2V3h6v6h-2v2h-2v2h2v2h2v6h-6v-1h-2v-2h-2v-2H9v5H3V3z" },
  tiktok: { label: "TikTok", url: (h) => `https://www.tiktok.com/@${h}`, path: "M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 00-.8-.1 5.7 5.7 0 105.7 5.7V9a7.4 7.4 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z" },
  x: { label: "X", url: (h) => `https://x.com/${h}`, path: "M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.3L1 2h6.3l4.4 5.9L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" },
};

function initTalents(section) {
  const stage = section.querySelector(".talents__stage");
  const count = section.querySelector(".talents__count");
  const timer = section.querySelector(".talents__timer");
  const n = TALENTS.length;
  const pad = (v) => String(v).padStart(2, "0");

  stage.innerHTML = TALENTS.map((t, i) => {
    const socials = Object.entries(t.socials)
      .map(([k, h]) => `<li><a href="${SOCIALS[k].url(h)}" target="_blank" rel="noopener" aria-label="${t.name} on ${SOCIALS[k].label}"><svg viewBox="0 0 24 24"><path d="${SOCIALS[k].path}"/></svg></a></li>`)
      .join("");
    return `<article class="talent" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}: ${t.name}">
      <div class="talent__img">
        <img src="assets/talents/${t.id}.webp" width="600" height="750" alt="${t.name}" loading="lazy" decoding="async" draggable="false" />
        <h3 class="talent__name">${t.name}</h3>
      </div>
      <div class="talent__body">
        <ul class="talent__tags">${t.tags.map((g) => `<li>${g}</li>`).join("")}</ul>
        <ul class="talent__socials">${socials}</ul>
      </div>
    </article>`;
  }).join("");
  const cards = [...stage.children];

  let active = 0;
  let hovering = false, visible = false;

  function render() {
    const side = +getComputedStyle(stage).getPropertyValue("--side") || 2;
    cards.forEach((card, i) => {
      let o = (((i - active) % n) + n) % n;
      if (o > n / 2) o -= n; // shortest way round the loop
      card.style.setProperty("--o", o);
      card.classList.toggle("is-active", o === 0);
      card.classList.toggle("is-off", Math.abs(o) > side);
      card.inert = Math.abs(o) > side;
    });
    count.innerHTML = `<b>${pad(active + 1)}</b> / ${pad(n)}`;
    restartTimer();
  }

  function go(step) {
    active = (((active + step) % n) + n) % n;
    render();
  }

  // autoplay: the CSS timer bar runs, its animationend advances (no timer under reduced motion)
  function restartTimer() {
    timer.classList.remove("is-running");
    void timer.offsetWidth;
    timer.classList.add("is-running");
    syncPause();
  }
  function syncPause() {
    timer.classList.toggle("is-paused", hovering || !visible || document.hidden);
  }
  timer.addEventListener("animationend", () => go(1));

  section.querySelectorAll(".talents__nav").forEach((b) => b.addEventListener("click", () => go(+b.dataset.dir)));
  stage.addEventListener("click", (e) => {
    const card = e.target.closest(".talent");
    if (swiped) return;
    if (card && !card.classList.contains("is-active")) go(+card.style.getPropertyValue("--o"));
  });

  // swipe
  let startX = null, swiped = false;
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; swiped = false; });
  stage.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) { swiped = true; go(dx < 0 ? 1 : -1); }
  });

  stage.addEventListener("mouseenter", () => { hovering = true; syncPause(); });
  stage.addEventListener("mouseleave", () => { hovering = false; syncPause(); });
  section.addEventListener("focusin", () => { hovering = true; syncPause(); });
  section.addEventListener("focusout", () => { hovering = false; syncPause(); });
  document.addEventListener("visibilitychange", syncPause);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPause(); }, { threshold: 0.35 }).observe(stage);
  window.addEventListener("resize", render);

  render();
}

document.querySelectorAll(".talents").forEach(initTalents);

// ---------------------------------------------------------------------------
// Hand-drawn background strokes (like the line art in the deck)
// ---------------------------------------------------------------------------
const STROKE_TEMPLATES = [
  [[60, 1080], [200, 830], [330, 640], [460, 430], [560, 260], [640, 110], [700, 95], [760, 170], [800, 330], [880, 520], [960, 700], [1080, 1080]],
  [[1000, 1080], [1250, 700], [1500, 330], [1760, 0]],
  [[1380, 1080], [1560, 750], [1720, 420], [1920, 120]],
  [[0, 560], [120, 380], [260, 120], [330, 0]],
  [[1180, 1080], [1300, 860], [1400, 700], [1460, 760], [1560, 1080]],
];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function strokePath(points, rand, mirror) {
  const pts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(2, Math.round(len / 40));
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const j = (rand() - 0.5) * 14;
      pts.push([x1 + (x2 - x1) * t + nx * j, y1 + (y2 - y1) * t + ny * j]);
    }
  }
  pts.push(points[points.length - 1]);
  return "M" + pts.map(([x, y]) => `${(mirror ? 1920 - x : x).toFixed(1)} ${y.toFixed(1)}`).join(" L");
}

document.querySelectorAll("[data-strokes]").forEach((svg, i) => {
  const rand = mulberry32(i * 97 + 13);
  const mirror = i % 2 === 1;
  svg.innerHTML = STROKE_TEMPLATES.map(
    (t) => `<path pathLength="1" d="${strokePath(t, rand, mirror)}"/>`
  ).join("");
});

// ---------------------------------------------------------------------------
// Bail out if animations are unavailable or unwanted
// ---------------------------------------------------------------------------
const root = document.documentElement;
if (!window.gsap || !window.ScrollTrigger || REDUCED) {
  root.classList.remove("js-anim");
  document.querySelectorAll(".hl").forEach((el) => el.style.setProperty("--hl", 1));
} else {
  initAnimations();
}

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------
function splitChars(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.innerHTML = words
    .map(
      (w) =>
        `<span class="split-word" aria-hidden="true" style="overflow:hidden;vertical-align:top;padding-bottom:.06em">${[...w]
          .map((c) => `<span class="split-char">${c}</span>`)
          .join("")}</span>`
    )
    .join(" ");
  return el.querySelectorAll(".split-char");
}

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="split-word">${w}</span>`).join(" ");
  return el.querySelectorAll(".split-word");
}

// Brush Q "written" stroke by stroke (like the signature GIF): oval → slash → inner strokes,
// then the mask is dropped so the brush fibres stay crisp. Strokes use pathLength=100 (GSAP rounds px).
function writeQ(svg, vars) {
  const $ = (sel) => svg.querySelectorAll(sel);
  gsap.set($(".q-stroke"), { strokeDasharray: 100, strokeDashoffset: 100 });
  return gsap
    .timeline(vars)
    .to($(".q-oval"), { strokeDashoffset: 0, duration: 1.15, ease: "power1.inOut" })
    .to($(".q-slash"), { strokeDashoffset: 0, duration: 0.45, ease: "power2.in" })
    .to($(".q-inner"), { strokeDashoffset: 0, duration: 0.25, stagger: 0.08, ease: "power1.out" })
    .add(() => svg.querySelector("image").removeAttribute("mask"));
}

// Copy of the hero Q (same mask strokes) with its own mask id so both animate independently
function cloneQ(id) {
  const svg = document.querySelector(".hero__q").cloneNode(true);
  ["class", "data-filter", "data-depth", "aria-hidden"].forEach((a) => svg.removeAttribute(a));
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Qevo logo");
  svg.querySelector("mask").id = id;
  svg.querySelector("image").setAttribute("mask", `url(#${id})`);
  return svg;
}

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.globalTimeline.timeScale(1.6); // snappier reveals overall (scrubbed tweens follow scroll, unaffected)

  // Smooth scroll
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.4 });
      })
    );
  }

  // Scroll progress
  gsap.to(".progress span", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  // Background strokes draw in
  document.querySelectorAll("[data-strokes]").forEach((svg) => {
    const paths = svg.querySelectorAll("path");
    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2.6,
      ease: "power2.inOut",
      stagger: 0.18,
      scrollTrigger: { trigger: svg.parentElement, start: "top 75%" },
    });
  });

  // ---- Hero intro
  const heroChars = splitChars(document.querySelector(".hero__title"));
  const footerQ = cloneQ("q-write-footer"); // cloned before the hero intro drops its mask
  root.classList.remove("js-anim");
  gsap.set(".hero__person", { xPercent: -50, x: 0 });
  const intro = gsap
    .timeline({ paused: true, defaults: { ease: "expo.out" } })
    // layers: intro uses mask/clip-path, scroll uses yPercent, mouse uses x/y — no conflicts
    .add(writeQ(document.querySelector(".hero__q")))
    .addLabel("reveal", "-=0.25")
    // Kevin grows from the centre line outward (up + down), like the GIF's divider bar
    .fromTo(
      ".hero__person",
      { clipPath: "inset(50% 0% 50% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", clearProps: "clipPath" },
      "reveal"
    )
    .from(".hero__eyebrow", { y: 20, autoAlpha: 0, duration: 0.8 }, 0.3)
    .from(heroChars, { yPercent: 115, duration: 1.1, stagger: 0.025 }, 0.5)
    .from(".hero__tags li", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.7")
    .from(".scroll-cue", { autoAlpha: 0, duration: 0.6 }, "-=0.3")
    .from(".nav", { y: -30, autoAlpha: 0, duration: 0.8 }, "reveal") // nav drops in together with Kevin
    .timeScale(1.7);

  // Start only once fonts + hero images are decoded and painted; otherwise the first-paint hitch
  // (with lagSmoothing off) makes the Q "write" itself instantly.
  const decode = (src) => { const im = new Image(); im.src = src; return im.decode().catch(() => {}); };
  const ready = Promise.all([
    document.fonts.ready,
    decode(document.querySelector(".hero__person").currentSrc || document.querySelector(".hero__person").src),
    decode(document.querySelector(".hero__q image").getAttribute("href")),
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() =>
    requestAnimationFrame(() => requestAnimationFrame(() => intro.play()))
  );

  // Footer Q: same brush writing as the hero, once, the first time it scrolls into view
  document.querySelector(".thanks__mark img").replaceWith(footerQ);
  writeQ(footerQ, { scrollTrigger: { trigger: footerQ, start: "top 80%", once: true } }).timeScale(1.7);

  // Hero parallax out
  const heroScroll = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__q", { yPercent: 22, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hero__person", { yPercent: 6, ease: "none", scrollTrigger: heroScroll });
  gsap.to(".hero__copy", {
    y: -80,
    autoAlpha: 0.2,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // ---- Section titles (char reveal)
  document.querySelectorAll("[data-split]:not(.hero__title)").forEach((el) => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 115,
      duration: 1,
      ease: "expo.out",
      stagger: 0.02,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  gsap.utils.toArray(".subhead, .tag").forEach((el) =>
    gsap.from(el, {
      y: 16,
      autoAlpha: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    })
  );

  // ---- Paragraph reveals (mask up)
  gsap.utils.toArray(".reveal-line").forEach((el) =>
    gsap.fromTo(
      el,
      { y: 40, autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" },
      {
        y: 0,
        autoAlpha: 1,
        clipPath: "inset(0% 0% -10% 0%)",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }
    )
  );

  // ---- Profile: counters, 360 highlight, pillars
  document.querySelectorAll(".count-inline").forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.count,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => (el.textContent = Math.round(o.v) + (el.dataset.suffix || "")),
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  document.querySelectorAll(".hl").forEach((el) =>
    gsap.fromTo(
      el,
      { "--hl": 0 },
      { "--hl": 1, duration: 0.9, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 75%" } }
    )
  );
  gsap.from(".pillars li", {
    y: 40,
    autoAlpha: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "expo.out",
    scrollTrigger: { trigger: ".pillars", start: "top 88%" },
  });

  // ---- Fara
  // poster depth: sky drifts slower than the demon, which breaks out of the frame
  const posterScroll = { trigger: ".poster", start: "top bottom", end: "bottom top", scrub: true };
  gsap.fromTo(".poster__sky", { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: posterScroll });
  gsap.fromTo(".poster__demon", { yPercent: 5 }, { yPercent: -3, ease: "none", scrollTrigger: posterScroll });
  gsap
    .timeline({ scrollTrigger: { trigger: ".poster", start: "top 75%" } })
    .fromTo(".poster__frame", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" })
    .from(".poster__sky", { scale: 1.4, duration: 2, ease: "expo.out" }, "<")
    .from(".poster__demon", { autoAlpha: 0, scale: 0.88, transformOrigin: "50% 100%", duration: 1.4, ease: "expo.out" }, "-=1.1");
  const quoteWords = splitWords(document.querySelector("[data-words]"));
  gsap
    .timeline({ scrollTrigger: { trigger: ".quote", start: "top 80%" } })
    .from(".quote", { autoAlpha: 0, y: 40, duration: 0.9, ease: "expo.out" })
    .from(quoteWords, { autoAlpha: 0.08, duration: 0.25, stagger: 0.03, ease: "none" }, "-=0.4")
    .from(".quote figcaption", { autoAlpha: 0, x: -20, duration: 0.6 }, "-=0.2");

  // ---- Posts: reveal + hover tilt
  gsap.utils.toArray(".posts--2 .post").forEach((post, i) =>
    gsap.from(post, {
      y: 80,
      autoAlpha: 0,
      duration: 1.2,
      delay: i * 0.15,
      ease: "expo.out",
      scrollTrigger: { trigger: post, start: "top 85%" },
    })
  );
  gsap.fromTo(
    ".post--zoom .post__img",
    { scale: 0.62, borderRadius: 24 },
    {
      scale: 1,
      borderRadius: 0,
      ease: "none",
      scrollTrigger: { trigger: ".post--zoom", start: "top 95%", end: "center 55%", scrub: true },
    }
  );
  gsap.from(".post--zoom figcaption", {
    autoAlpha: 0,
    y: 20,
    scrollTrigger: { trigger: ".post--zoom figcaption", start: "top 90%" },
  });

  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".post__img").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        gsap.to(card, { rotateY: (px - 0.5) * 8, rotateX: (0.5 - py) * 8, transformPerspective: 900, duration: 0.5 });
      });
      card.addEventListener("mouseleave", () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "expo.out" }));
    });
  }

  // ---- Q logo hover: boiling displacement + vibration (CSS .is-glitching)
  // each logo owns its filter, tween and "boil" ticker — fully independent
  document.querySelectorAll(".q-fx").forEach((q) => {
    const filter = document.getElementById(q.dataset.filter);
    const disp = filter.querySelector("feDisplacementMap");
    const turb = filter.querySelector("feTurbulence");
    const hit = q.closest("a") || q;
    const strength = q.classList.contains("hero__q") ? 38 : 2; // nav logo: barely-there
    let seed = 1, lastSeed = 0;
    const boil = (time) => {
      if (time - lastSeed > 0.07) { turb.setAttribute("seed", ++seed); lastSeed = time; }
    };
    hit.addEventListener("mouseenter", () => {
      gsap.ticker.remove(boil);
      gsap.ticker.add(boil);
      q.classList.add("is-glitching");
      gsap.to(disp, { attr: { scale: strength }, duration: 0.25, ease: "power2.out", overwrite: true });
    });
    hit.addEventListener("mouseleave", () => {
      gsap.to(disp, {
        attr: { scale: 0 }, duration: 0.45, ease: "power3.out", overwrite: true,
        onComplete: () => { q.classList.remove("is-glitching"); gsap.ticker.remove(boil); },
      });
    });
  });

  // ---- Mouse depth parallax ([data-depth] layers inside a [data-depth-scene])
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-depth-scene]").forEach((scene) => {
      const layers = [...scene.querySelectorAll("[data-depth]")].map((el) => ({
        depth: +el.dataset.depth,
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
      }));
      const area = scene.closest("section");
      area.addEventListener("mousemove", (e) => {
        const r = area.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => { l.x(dx * l.depth * 50); l.y(dy * l.depth * 30); });
      });
      area.addEventListener("mouseleave", () => layers.forEach((l) => { l.x(0); l.y(0); }));
    });
  }

  // ---- Dashboards
  document.querySelectorAll(".dash").forEach((dash) => {
    const cards = dash.querySelectorAll(".card");
    const nums = dash.querySelectorAll(".card__num");
    const deltas = dash.querySelectorAll(".card__delta, .card__of");
    const bars = dash.querySelectorAll(".chart__bar");

    const tl = gsap.timeline({ scrollTrigger: { trigger: dash, start: "top 80%" } });
    tl.from(cards, { y: 40, autoAlpha: 0, duration: 0.8, stagger: { each: 0.06, grid: "auto", from: "start" }, ease: "expo.out" });
    nums.forEach((el, i) => {
      const { num, dec, suffix } = parseValue(el.dataset.value);
      const o = { v: 0 };
      el.textContent = (0).toFixed(dec) + suffix;
      tl.to(
        o,
        {
          v: num,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = o.v.toFixed(dec) + suffix),
        },
        0.15 + i * 0.06
      );
    });
    tl.from(deltas, { autoAlpha: 0, x: -8, duration: 0.5, stagger: 0.05 }, 1.1);
    tl.from(dash.querySelector(".chart"), { autoAlpha: 0, x: 40, duration: 0.9, ease: "expo.out" }, 0.2);
    tl.from(bars, { scaleY: 0, duration: 0.9, stagger: 0.025, ease: "expo.out" }, 0.5);
  });

  // ---- Events
  gsap.set(".event", { clipPath: "inset(0% 0% 100% 0%)" });
  ScrollTrigger.batch(".event", {
    start: "top 88%",
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { clipPath: "inset(-10% -10% -10% -10%)", duration: 1.2, ease: "expo.inOut", stagger: 0.12 });
      gsap.fromTo(batch.map((b) => b.querySelector("img")), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out", stagger: 0.12 });
      gsap.from(batch.map((b) => b.querySelector("figcaption")), { y: 20, autoAlpha: 0, duration: 0.8, delay: 0.6, stagger: 0.12 });
    },
  });

  // ---- Talents
  gsap
    .timeline({ scrollTrigger: { trigger: ".talents__stage", start: "top 80%" } })
    .from(".talents__stage", { autoAlpha: 0, y: 80, duration: 1.2, ease: "expo.out" })
    .from(".talents__controls > *", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.06, ease: "power3.out" }, "-=0.7");

  // ---- Brands
  ScrollTrigger.batch(".brand", {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.from(batch.map((b) => b.querySelector("img")), { autoAlpha: 0, y: 30, duration: 1, stagger: 0.05, ease: "expo.out", clearProps: "opacity,visibility,transform" }),
  });

  // ---- Management plus
  gsap.utils.toArray(".plus__list li").forEach((li) => {
    gsap
      .timeline({ scrollTrigger: { trigger: li, start: "top 88%" } })
      .fromTo(li, { "--line": 0 }, { "--line": 1, duration: 1.2, ease: "expo.inOut" })
      .from(li.querySelector(".plus__n"), { autoAlpha: 0, x: -20, duration: 0.6 }, 0.1)
      .from(li.querySelector("p"), { autoAlpha: 0, x: -60, duration: 1, ease: "expo.out" }, 0.2);
  });

  // ---- Thanks
  gsap
    .timeline({ scrollTrigger: { trigger: ".thanks", start: "top 60%" } })
    .from(".thanks__mark img", { autoAlpha: 0, scale: 0.6, rotate: -35, duration: 1.6, ease: "expo.out" })
    .from(".thanks__sub, .btn, .socials li", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08, ease: "expo.out" }, "-=1");
  gsap.to(".thanks__mark", {
    rotate: 8,
    ease: "none",
    scrollTrigger: { trigger: ".thanks", start: "top bottom", end: "bottom bottom", scrub: true },
  });

  // Images may change layout after load
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
