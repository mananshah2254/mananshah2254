// Builds the static, animated SVG assets for the profile README.
// Run: node scripts/cards.mjs   (writes into assets/)
// GitHub serves README images through its camo proxy: no scripts, no external
// fonts or images. Everything here is inline SVG + CSS keyframes + SMIL.
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = new URL("../assets/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const BG0 = "#0a0b16", BG1 = "#11132a", BG2 = "#1b1430", PEACH = "#ffab70", INK = "#f7f5f0", DIM = "#a9a4b8";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* greedy wrap by character budget; good enough for a fixed-size card */
function wrap(text, max) {
  const lines = []; let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
    else cur += " " + w;
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}

/* ------------------------------------------------------------------ */
/*  product motifs: each one is a small animated glyph in a 120x120 box */
/* ------------------------------------------------------------------ */
const motifs = {
  dialdo: c => `
    <g transform="translate(60 60)">
      ${[0, 1, 2].map(i => `<circle r="22" fill="none" stroke="${c}" stroke-width="1.5" opacity="0">
        <animate attributeName="r" values="22;56" dur="2.4s" begin="${i * 0.8}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".7;0" dur="2.4s" begin="${i * 0.8}s" repeatCount="indefinite"/></circle>`).join("")}
      <circle r="30" fill="#181713" stroke="${c}" stroke-opacity=".5" stroke-width="1.5"/>
      ${[-16, -8, 0, 8, 16].map((x, i) => `<rect x="${x - 2.5}" y="-6" width="5" height="12" rx="2.5" fill="#fff8eb">
        <animate attributeName="height" values="6;${[14, 26, 34, 22, 12][i]};6" dur="${0.9 + i * 0.13}s" repeatCount="indefinite"/>
        <animate attributeName="y" values="-3;${-[14, 26, 34, 22, 12][i] / 2};-3" dur="${0.9 + i * 0.13}s" repeatCount="indefinite"/></rect>`).join("")}
    </g>`,
  reporun: c => `
    <g transform="translate(18 22)">
      <rect width="84" height="78" rx="10" fill="#0e1a14" stroke="${c}" stroke-opacity=".45" stroke-width="1.5"/>
      ${[0, 1, 2, 3].map(i => `
        <rect x="32" y="${14 + i * 15}" width="${[38, 30, 42, 26][i]}" height="4" rx="2" fill="${c}" opacity=".35"/>
        <g opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${0.1 + i * 0.15};${0.15 + i * 0.15};.92;1" dur="4.5s" repeatCount="indefinite"/>
          <circle cx="18" cy="${16 + i * 15}" r="5.5" fill="${c}"/>
          <path d="M15.3 ${16 + i * 15} l2 2 3.6-4" fill="none" stroke="#0e1a14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <circle cx="18" cy="${16 + i * 15}" r="5.5" fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="1.2"/>`).join("")}
    </g>`,
  trailmail: c => `
    <path id="tmArc" d="M -10 96 C 30 90, 60 40, 130 26" fill="none"/>
    <path d="M -10 96 C 30 90, 60 40, 130 26" fill="none" stroke="${c}" stroke-opacity=".18" stroke-dasharray="3 6"/>
    <g>
      <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto"><mpath href="#tmArc"/></animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.8;1" dur="3.6s" repeatCount="indefinite"/>
      <path d="M -54 0 L -14 0" stroke="${c}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
      <rect x="-13" y="-9" width="26" height="18" rx="3" fill="${c}"/>
      <path d="M -13 -8 L 0 2 L 13 -8" fill="none" stroke="${BG0}" stroke-width="1.8" stroke-linejoin="round"/>
    </g>`,
  gitpixelpush: c => {
    // a 7x7 heart that lights up cell by cell, like the contribution graph
    const heart = ["0110110", "1111111", "1111111", "1111111", "0111110", "0011100", "0001000"];
    let cells = "", n = 0;
    heart.forEach((row, y) => [...row].forEach((v, x) => {
      const on = v === "1";
      const d = (x + y) * 0.11;
      cells += `<rect x="${12 + x * 14}" y="${12 + y * 14}" width="11" height="11" rx="2.5" fill="${on ? c : "#1c2a22"}" ${on ? `opacity=".15"><animate attributeName="opacity" values=".15;1;1;.15" keyTimes="0;.18;.8;1" dur="3.4s" begin="${d.toFixed(2)}s" repeatCount="indefinite"/></rect>` : `opacity=".9"/>`}`;
      n++;
    }));
    return `<g>${cells}</g>`;
  },
  outreachos: c => `
    <g transform="translate(0 60)">
      <path d="M 16 0 H 104" stroke="${c}" stroke-opacity=".25" stroke-width="2"/>
      ${[16, 45, 75, 104].map((x, i) => `<circle cx="${x}" cy="0" r="9" fill="${BG0}" stroke="${c}" stroke-width="2"/>
        <circle cx="${x}" cy="0" r="4" fill="${c}" opacity=".2"><animate attributeName="opacity" values=".2;1;.2" dur="3.2s" begin="${i * 0.8}s" repeatCount="indefinite"/></circle>`).join("")}
      <circle r="3.2" fill="#fff"><animate attributeName="cx" values="16;104" dur="3.2s" repeatCount="indefinite"/></circle>
      ${["visit", "connect", "msg", "follow"].map((t, i) => `<text x="${[16, 45, 75, 104][i]}" y="${i % 2 ? -18 : 26}" text-anchor="middle" font-family="${MONO}" font-size="8.5" fill="${DIM}">${t}</text>`).join("")}
    </g>`,
  relay: c => `
    <path id="rlLoop" d="M 20 80 C 20 30, 100 30, 100 60 S 40 100, 60 50 S 110 20, 116 24" fill="none"/>
    <path d="M 20 80 C 20 30, 100 30, 100 60 S 40 100, 60 50 S 110 20, 116 24" fill="none" stroke="${c}" stroke-opacity=".18" stroke-dasharray="2 5"/>
    <g>
      <animateMotion dur="4.4s" repeatCount="indefinite" rotate="auto"><mpath href="#rlLoop"/></animateMotion>
      <path d="M -10 -8 L 12 0 L -10 8 L -5 0 Z" fill="${c}"/>
      <path d="M -5 0 L 12 0" stroke="${BG0}" stroke-width="1"/>
    </g>`,
};

/* ------------------------------------------------------------------ */
/*  product card                                                       */
/* ------------------------------------------------------------------ */
function card(p) {
  const W = 600, H = 236;
  const lines = wrap(p.desc, 58).slice(0, 3);
  let cx = 170;
  const chips = p.chips.map(t => {
    const w = t.length * 6.9 + 18;
    const g = `<g transform="translate(${cx} 190)"><rect width="${w}" height="22" rx="11" fill="${p.color}" fill-opacity=".09" stroke="${p.color}" stroke-opacity=".28"/><text x="${w / 2}" y="15" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${INK}" opacity=".85">${esc(t)}</text></g>`;
    cx += w + 7;
    return g;
  }).join("");
  const statusW = p.status.length * 8.1 + 34;
  const live = p.status === "LIVE";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.name)}: ${esc(p.desc)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/></linearGradient>
    <radialGradient id="glow" cx="12%" cy="40%" r="45%"><stop offset="0" stop-color="${p.color}" stop-opacity=".22"/><stop offset="1" stop-color="${p.color}" stop-opacity="0"/></radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${p.color}" stop-opacity="0"/><stop offset=".5" stop-color="${p.color}" stop-opacity=".9"/><stop offset="1" stop-color="${p.color}" stop-opacity="0"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-600 0;600 0" dur="${p.sweep}s" repeatCount="indefinite"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="16"/></clipPath>
  </defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}}
    .rise{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
    @keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .pulse{animation:pulse 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <g clip-path="url(#clip)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <g opacity=".05" stroke="${INK}">${Array.from({ length: 16 }, (_, i) => `<path d="M ${i * 40} 0 V ${H}"/>`).join("")}${Array.from({ length: 6 }, (_, i) => `<path d="M 0 ${i * 40} H ${W}"/>`).join("")}</g>
    <g transform="translate(22 58)">${motifs[p.key](p.color)}</g>
    <path d="M 150 30 V ${H - 30}" stroke="${INK}" stroke-opacity=".07"/>

    <g class="rise" style="animation-delay:.05s">
      <text class="m" x="170" y="42" font-size="11" letter-spacing="2.2" fill="${p.color}">${esc(p.eyebrow)}</text>
    </g>
    <g class="rise" style="animation-delay:.15s">
      <text class="t" x="168" y="80" font-size="29" font-weight="700" fill="${INK}" letter-spacing=".3">${esc(p.name)}</text>
    </g>
    <g class="rise" style="animation-delay:.3s">
      ${lines.map((l, i) => `<text class="t" x="170" y="${110 + i * 20}" font-size="13.5" fill="${DIM}">${esc(l)}</text>`).join("\n      ")}
    </g>
    <g class="rise" style="animation-delay:.45s">${chips}</g>

    <g transform="translate(${W - 22 - statusW} 24)">
      <rect width="${statusW}" height="24" rx="12" fill="${live ? "#39d353" : p.color}" fill-opacity=".1" stroke="${live ? "#39d353" : p.color}" stroke-opacity=".35"/>
      <circle class="pulse" cx="14" cy="12" r="4" fill="${live ? "#39d353" : p.color}"/>
      <text class="m" x="24" y="16.5" font-size="11" letter-spacing="1.2" fill="${INK}">${esc(p.status)}</text>
    </g>
    <text class="m" x="${W - 24}" y="${H - 50}" text-anchor="end" font-size="11.5" fill="${p.color}" opacity=".9">${esc(p.domain)} ↗</text>
  </g>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="url(#edge)" stroke-width="1.5"/>
</svg>
`;
}

export const products = [
  { key: "dialdo", name: "DialDo", color: "#ff6040", sweep: 6, status: "LIVE", domain: "dialdo.com",
    eyebrow: "VOICE AGENT · macOS",
    desc: "Gives your Mac a phone number. Call it and a local-first agent finds files, summarizes PDFs, writes documents and sends email. PIN-gated, every action audited.",
    chips: ["TypeScript", "Electron", "Twilio", "LLM tools", "SQLite"] },
  { key: "reporun", name: "Repo Run", color: "#8fd3a8", sweep: 7, status: "LIVE", domain: "reporun.app",
    eyebrow: "DESKTOP APP · macOS + WINDOWS",
    desc: "Know what a repo needs before you run it. Reads manifests, checks your machine for missing runtimes and version conflicts, and previews every command before it runs.",
    chips: ["TypeScript", "Electron", "React", "Supabase", "Vitest"] },
  { key: "trailmail", name: "TrailMail", color: "#ffab70", sweep: 6.5, status: "LIVE", domain: "trailmails.com",
    eyebrow: "CHROME EXTENSION · OUTREACH",
    desc: "Predicts work emails from public company patterns and sends personalized outreach through Gmail. Entirely client side, send-only OAuth scope, open and click tracking.",
    chips: ["JavaScript", "Chrome MV3", "Gmail API", "OAuth"] },
  { key: "gitpixelpush", name: "GitPixelPush", color: "#39d353", sweep: 7.5, status: "LIVE", domain: "gitpixelpush.com",
    eyebrow: "WEB APP · GIT DATA API",
    desc: "Paint pixel art on your GitHub contribution graph. Writes dated commits through the Git Data API from the browser: no clone, no server, and the token never leaves the page.",
    chips: ["JavaScript", "CF Workers", "GraphQL", "OAuth"] },
  { key: "outreachos", name: "OutreachOS", color: "#8ab4ff", sweep: 6.8, status: "OPEN SOURCE", domain: "github.com/mananshah2254/OutreachOS",
    eyebrow: "CHROME EXTENSION · CADENCES",
    desc: "Multi-step LinkedIn cadence engine: visit, connect, message, follow up. Sequenced with delays, daily caps and warm-up, running in your own browser session.",
    chips: ["JavaScript", "Chrome MV3", "Service Worker"] },
  { key: "relay", name: "Relay", color: "#c49bff", sweep: 7.2, status: "LIVE", domain: "App Store · free · iOS 17+",
    eyebrow: "iOS APP · ON THE APP STORE",
    desc: "Referral outreach from the iPhone share sheet: confirm role and company, find contacts, attach a résumé and queue Gmail sends with daily caps and a review mode.",
    chips: ["Swift", "SwiftUI", "Share Extension", "Node"] },
];

for (const p of products) writeFileSync(new URL(`card-${p.key}.svg`, OUT), card(p));

/* ------------------------------------------------------------------ */
/*  hero banner                                                        */
/* ------------------------------------------------------------------ */
function banner() {
  const W = 1200, H = 400;
  // agent graph: nodes on the right that light up as a "request" travels
  const nodes = [[860, 120], [960, 80], [1060, 130], [1010, 210], [900, 220], [1110, 220], [960, 300], [1080, 300]];
  const edges = [[0, 1], [1, 2], [0, 4], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [3, 6], [5, 7], [6, 7]];
  const left = nodes.map(([x, y]) => [W - x, y]); // mirrored constellation on the left
  const net = (pts, delay, op) => `
    <g opacity="${op}">
      ${edges.map(([a, b], i) => `<path d="M ${pts[a][0]} ${pts[a][1]} L ${pts[b][0]} ${pts[b][1]}" stroke="${PEACH}" stroke-opacity=".16" stroke-width="1"/>
      <path d="M ${pts[a][0]} ${pts[a][1]} L ${pts[b][0]} ${pts[b][1]}" stroke="${PEACH}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="14 400" stroke-dashoffset="14" opacity=".9">
        <animate attributeName="stroke-dashoffset" values="14;-200" dur="3.2s" begin="${(delay + i * 0.27).toFixed(2)}s" repeatCount="indefinite"/></path>`).join("")}
      ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="${PEACH}" opacity=".08"><animate attributeName="r" values="6;13;6" dur="${3 + (i % 3)}s" begin="${i * 0.4}s" repeatCount="indefinite"/></circle>
      <circle cx="${x}" cy="${y}" r="3.4" fill="${i % 3 === 0 ? PEACH : INK}"><animate attributeName="opacity" values=".35;1;.35" dur="${2.4 + (i % 4) * 0.5}s" begin="${i * 0.3}s" repeatCount="indefinite"/></circle>`).join("")}
    </g>`;

  const stars = Array.from({ length: 34 }, (_, i) => {
    const x = (i * 211 + 37) % W, y = (i * 97 + 23) % 250, r = 0.6 + (i % 3) * 0.35;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"><animate attributeName="opacity" values=".1;.7;.1" dur="${3 + (i % 5)}s" begin="${(i % 7) * 0.6}s" repeatCount="indefinite"/></circle>`;
  }).join("");

  // perspective floor: horizontal lines scroll toward the viewer, verticals converge
  const floorY = 300;
  const verts = Array.from({ length: 25 }, (_, i) => {
    const x = -600 + i * 100;
    return `<path d="M ${600 + (x - 600) * 0.08} ${floorY} L ${x} ${H + 40}"/>`;
  }).join("");
  const horiz = Array.from({ length: 6 }, (_, i) => `<path d="M 0 0 H ${W}">
      <animateTransform attributeName="transform" type="translate" values="0 ${floorY};0 ${H + 20}" dur="4.8s" begin="${-i * 0.8}s" repeatCount="indefinite" calcMode="spline" keySplines=".6 0 1 1" keyTimes="0;1"/>
      <animate attributeName="stroke-opacity" values="0;.5" dur="4.8s" begin="${-i * 0.8}s" repeatCount="indefinite"/></path>`).join("");

  const roles = [
    "AI ENGINEER  ·  PAYPAL  ·  SAN FRANCISCO",
    "RAG PIPELINES THAT HOLD UP IN PRODUCTION",
    "AGENTS  ·  TOOL CALLING  ·  EMBEDDINGS",
    "SIX PRODUCTS, BUILT AND SHIPPED SOLO",
  ];
  const slot = 3.5, cycle = slot * roles.length;
  const k1 = (0.06 / roles.length).toFixed(3), k2 = ((slot - 0.4) / cycle).toFixed(3), k3 = (slot / cycle).toFixed(3);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Manan Shah. AI Engineer at PayPal, San Francisco. Builds RAG pipelines, agents and ships products.">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset=".55" stop-color="${BG1}"/><stop offset="1" stop-color="${BG2}"/></linearGradient>
    <radialGradient id="dusk" cx="50%" cy="78%" r="60%"><stop offset="0" stop-color="${PEACH}" stop-opacity=".28"/><stop offset=".5" stop-color="#ff7d5c" stop-opacity=".07"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/></radialGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${INK}"/><stop offset=".42" stop-color="${INK}"/><stop offset=".5" stop-color="#ffc79b"/><stop offset=".58" stop-color="${INK}"/><stop offset="1" stop-color="${INK}"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;1 0;-1 0" dur="7s" repeatCount="indefinite"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset=".5" stop-color="${PEACH}"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/></linearGradient>
    <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
    <mask id="floorMask"><rect y="${floorY}" width="${W}" height="${H - floorY}" fill="url(#floorFade)"/></mask>
    <linearGradient id="trailFade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset="1" stop-color="${PEACH}" stop-opacity=".85"/></linearGradient>
    <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="tiny" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>
    <path id="arc" d="M -60 330 C 250 250, 470 230, 640 250 S 1000 300, 1270 200"/>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}}
    .in{animation:in 1s cubic-bezier(.2,.7,.2,1) both}
    @keyframes in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    .blink{animation:blink 1.1s steps(1) infinite}
    @keyframes blink{50%{opacity:0}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <rect width="${W}" height="${H}" fill="url(#dusk)"/>
    <g>${stars}</g>
    <ellipse cx="600" cy="${floorY}" rx="560" ry="40" fill="#ff8a5c" opacity=".12" filter="url(#soft)"/>
    <g mask="url(#floorMask)" stroke="${PEACH}" stroke-opacity=".22" stroke-width="1" fill="none">${verts}${horiz}</g>
    <path d="M 0 ${floorY} H ${W}" stroke="url(#rule)" stroke-width="1.2" opacity=".6"/>

    ${net(nodes, 0, 0.9)}
    ${net(left, 1.6, 0.55)}

    <use href="#arc" fill="none" stroke="${PEACH}" stroke-opacity=".1" stroke-width="1.2" stroke-dasharray="5 11"/>
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.86;1" dur="9s" repeatCount="indefinite"/>
      <path d="M -130 0 L 0 0" stroke="url(#trailFade)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle r="10" fill="${PEACH}" opacity=".3" filter="url(#tiny)"/>
      <circle r="3.6" fill="#fff3e6"/>
      <animateMotion dur="9s" repeatCount="indefinite" rotate="auto"><mpath href="#arc"/></animateMotion>
    </g>

    <g text-anchor="middle">
      <g class="in" style="animation-delay:.1s">
        <rect x="466" y="70" width="268" height="30" rx="15" fill="${PEACH}" fill-opacity=".08" stroke="${PEACH}" stroke-opacity=".35"/>
        <circle cx="490" cy="85" r="4" fill="#39d353"><animate attributeName="opacity" values="1;.3;1" dur="1.8s" repeatCount="indefinite"/></circle>
        <text class="m" x="610" y="90" font-size="12.5" letter-spacing="3" fill="${PEACH}">BUILDING IN PUBLIC</text>
      </g>
      <g class="in" style="animation-delay:.3s">
        <text class="t" x="600" y="186" font-size="86" font-weight="800" letter-spacing="8" fill="url(#shine)">MANAN SHAH</text>
      </g>
      <rect x="450" y="210" width="300" height="2" rx="1" fill="url(#rule)">
        <animate attributeName="width" values="0;300" dur="1.2s" begin=".6s" fill="freeze"/>
        <animate attributeName="x" values="600;450" dur="1.2s" begin=".6s" fill="freeze"/>
      </rect>
      <g class="m" font-size="17" letter-spacing="2.6" fill="#dcd8d0">
        ${roles.map((r, i) => `<text x="600" y="254" opacity="0">${esc(r)}<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;${k1};${k2};${k3};1" dur="${cycle}s" begin="${(i * slot).toFixed(1)}s" repeatCount="indefinite"/></text>`).join("\n        ")}
      </g>
    </g>
    <g class="m in" font-size="11.5" fill="${DIM}" style="animation-delay:.9s">
      <text x="34" y="${H - 26}">~/mananshah2254 <tspan fill="${PEACH}">$</tspan> ship --prod<tspan class="blink" fill="${PEACH}"> ▍</tspan></text>
      <text x="${W - 34}" y="${H - 26}" text-anchor="end">37.77° N, 122.42° W</text>
    </g>
  </g>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="${PEACH}" stroke-opacity=".2" stroke-width="1.5"/>
</svg>
`;
}
writeFileSync(new URL("banner.svg", OUT), banner());

/* ------------------------------------------------------------------ */
/*  whoami terminal: types itself out line by line, then holds         */
/* ------------------------------------------------------------------ */
function terminal() {
  const W = 1200;
  const rows = [
    ["cmd", "whoami --verbose"],
    ["kv", "name", "Manan Shah"],
    ["kv", "role", "AI Engineer @ PayPal  ·  LLM platform"],
    ["kv", "based", "San Francisco, CA"],
    ["kv", "focus", "[ RAG, agentic workflows, embeddings, semantic search ]"],
    ["kv", "stack", "[ Python, FastAPI, Amazon Bedrock, Pinecone, Kafka, Kubernetes ]"],
    ["kv", "background", "3+ yrs across fintech and enterprise insurance"],
    ["kv", "education", "MS Computer Science, Illinois Tech, 2025"],
    ["kv", "shipping", "DialDo · Repo Run · TrailMail · GitPixelPush · Relay (App Store) · OutreachOS"],
    ["ok", "ambiguous problem in, working system out."],
  ];
  const H = 64 + rows.length * 27 + 34;
  const step = 0.42;
  const body = rows.map((r, i) => {
    const y = 78 + i * 27, d = (0.5 + i * step).toFixed(2);
    let content;
    if (r[0] === "cmd") content = `<tspan fill="#39d353">➜</tspan> <tspan fill="#8ab4ff">~</tspan> <tspan fill="${INK}">${esc(r[1])}</tspan>`;
    else if (r[0] === "ok") content = `<tspan fill="#39d353">✓</tspan> <tspan fill="${PEACH}" font-style="italic">${esc(r[1])}</tspan>`;
    else content = `<tspan fill="${PEACH}">${esc(r[1].padEnd(11))}</tspan><tspan fill="${DIM}">: </tspan><tspan fill="${INK}">${esc(r[2])}</tspan>`;
    // typewriter reveal: a clip rect grows across the line
    return `<clipPath id="c${i}"><rect x="40" y="${y - 18}" height="26" width="1120"><set attributeName="width" to="0" begin="0s"/><animate attributeName="width" from="0" to="1120" dur="${r[0] === "cmd" ? 1.0 : 0.55}s" begin="${d}s" fill="freeze" calcMode="spline" keySplines=".3 0 .7 1" keyTimes="0;1"/></rect></clipPath>
    <text x="44" y="${y}" xml:space="preserve" clip-path="url(#c${i})">${content}</text>`;
  }).join("\n    ");
  const end = (0.5 + rows.length * step + 0.4).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="whoami: Manan Shah, AI Engineer at PayPal in San Francisco. Focus: RAG, agentic workflows, embeddings, semantic search. Stack: Python, FastAPI, Amazon Bedrock, Pinecone, Kafka, Kubernetes. MS Computer Science, Illinois Tech, 2025.">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0f1d"/><stop offset="1" stop-color="${BG0}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".1" stroke-width="1.5"/>
  <path d="M 0 44 H ${W}" stroke="${INK}" stroke-opacity=".08"/>
  <circle cx="26" cy="22" r="6.5" fill="#ff5f57"/><circle cx="48" cy="22" r="6.5" fill="#febc2e"/><circle cx="70" cy="22" r="6.5" fill="#28c840"/>
  <text x="600" y="27" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${DIM}">manan@sf — zsh — 120×${rows.length + 2}</text>
  <g font-family="${MONO}" font-size="15.5">
    ${body}
    <rect x="44" y="${78 + rows.length * 27 - 16}" width="9" height="19" fill="${PEACH}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="1.1s" begin="${end}s" repeatCount="indefinite" calcMode="discrete"/>
    </rect>
  </g>
</svg>
`;
}
writeFileSync(new URL("terminal.svg", OUT), terminal());

/* ------------------------------------------------------------------ */
/*  career timeline                                                    */
/* ------------------------------------------------------------------ */
function timeline() {
  const W = 1200, H = 230;
  const stops = [
    { x: 150, when: "2019", what: "First commit", sub: "algorithms, web apps, open source", c: DIM },
    { x: 450, when: "MAR 2021 — JUL 2023", what: "Duck Creek Technologies", sub: "Software Engineer · enterprise insurance", c: "#8ab4ff" },
    { x: 750, when: "AUG 2023 — MAY 2025", what: "Illinois Institute of Technology", sub: "MS, Computer Science", c: "#c49bff" },
    { x: 1050, when: "APR 2025 — NOW", what: "PayPal", sub: "Software Engineer · AI and LLM platform", c: PEACH, now: true },
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Career: Duck Creek Technologies 2021 to 2023, MS Computer Science at Illinois Tech 2023 to 2025, PayPal AI and LLM platform since April 2025.">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/></linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${DIM}" stop-opacity=".2"/><stop offset=".55" stop-color="#c49bff"/><stop offset="1" stop-color="${PEACH}"/></linearGradient>
  </defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}}
    .in{animation:in .8s cubic-bezier(.2,.7,.2,1) both}
    @keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  <path d="M 80 100 H 1120" stroke="${INK}" stroke-opacity=".08" stroke-width="3" stroke-linecap="round"/>
  <path d="M 80 100 H 1120" stroke="url(#line)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1040" stroke-dashoffset="0">
    <set attributeName="stroke-dashoffset" to="1040" begin="0s"/>
    <animate attributeName="stroke-dashoffset" from="1040" to="0" dur="2.4s" begin=".2s" fill="freeze" calcMode="spline" keySplines=".5 0 .2 1" keyTimes="0;1"/>
  </path>
  <circle r="4" fill="#fff" opacity="0">
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="3s" begin="2.8s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="80;1120" dur="3s" begin="2.8s" repeatCount="indefinite"/>
    <set attributeName="cy" to="100" begin="0s"/>
  </circle>
  ${stops.map((s, i) => {
    const d = (0.3 + i * 0.55).toFixed(2);
    return `<g class="in" style="animation-delay:${d}s">
    ${s.now ? `<circle cx="${s.x}" cy="100" r="10" fill="none" stroke="${s.c}" stroke-width="1.5"><animate attributeName="r" values="10;24" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2s" repeatCount="indefinite"/></circle>` : ""}
    <circle cx="${s.x}" cy="100" r="10" fill="${BG0}" stroke="${s.c}" stroke-width="3"/>
    <circle cx="${s.x}" cy="100" r="4" fill="${s.c}"/>
    <text class="m" x="${s.x}" y="62" text-anchor="middle" font-size="11.5" letter-spacing="1.6" fill="${s.c}">${esc(s.when)}</text>
    <text class="t" x="${s.x}" y="146" text-anchor="middle" font-size="18" font-weight="700" fill="${INK}">${esc(s.what)}</text>
    <text class="t" x="${s.x}" y="170" text-anchor="middle" font-size="13" fill="${DIM}">${esc(s.sub)}</text>
  </g>`;
  }).join("\n  ")}
</svg>
`;
}
writeFileSync(new URL("timeline.svg", OUT), timeline());

/* ------------------------------------------------------------------ */
/*  section divider + footer                                           */
/* ------------------------------------------------------------------ */
writeFileSync(new URL("divider.svg", OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 24" width="1200" height="24" role="presentation">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset=".5" stop-color="${PEACH}"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-1200 0;1200 0" dur="5s" repeatCount="indefinite"/></linearGradient></defs>
  <path d="M 0 12 H 1200" stroke="${PEACH}" stroke-opacity=".15"/>
  <path d="M 0 12 H 1200" stroke="url(#g)" stroke-width="1.6"/>
  <circle cx="600" cy="12" r="3.5" fill="${PEACH}"><animate attributeName="r" values="2.5;4.5;2.5" dur="2.4s" repeatCount="indefinite"/></circle>
</svg>
`);

writeFileSync(new URL("footer.svg", OUT), (() => {
  const W = 1200, H = 150;
  const wave = (amp, ph, op, dur) => {
    const pts = (shift) => Array.from({ length: 61 }, (_, i) => {
      const x = i * 20, env = Math.sin((i / 60) * Math.PI);
      return `${x},${(75 + Math.sin(i * 0.45 + ph + shift) * amp * env).toFixed(1)}`;
    }).join(" ");
    return `<polyline fill="none" stroke="${PEACH}" stroke-width="2" stroke-linecap="round" opacity="${op}" points="${pts(0)}"><animate attributeName="points" values="${pts(0)};${pts(Math.PI)};${pts(0)}" dur="${dur}s" repeatCount="indefinite"/></polyline>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Thanks for stopping by.">
  <defs><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${PEACH}" stop-opacity=".14"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${wave(26, 0, 0.9, 5)}${wave(18, 1.6, 0.35, 6.5)}${wave(34, 3.1, 0.18, 8)}
  <rect x="455" y="58" width="290" height="34" rx="17" fill="${BG0}" stroke="${PEACH}" stroke-opacity=".35"/>
  <text x="600" y="80" text-anchor="middle" font-family="${MONO}" font-size="13" letter-spacing="2.5" fill="${INK}">THANKS FOR STOPPING BY</text>
</svg>
`;
})());

console.log("built:", ["banner", "terminal", "timeline", "divider", "footer", ...products.map(p => "card-" + p.key)].join(", "));
