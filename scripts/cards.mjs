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
  // one window lifts off the desktop and beams to a phone
  remotewindow: c => `
    <rect x="8" y="22" width="78" height="56" rx="7" fill="#101a12" stroke="${c}" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="16" y="32" width="26" height="16" rx="3" fill="${c}" opacity=".12"/>
    <rect x="16" y="54" width="40" height="14" rx="3" fill="${c}" opacity=".12"/>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 0;34 6;34 6;0 0" keyTimes="0;.15;.5;.85;1" dur="4.6s" repeatCount="indefinite"/>
      <rect x="46" y="30" width="32" height="22" rx="4" fill="${c}"/>
      <circle cx="51" cy="35" r="1.4" fill="${BG0}"/><circle cx="56" cy="35" r="1.4" fill="${BG0}"/>
      <path d="M 51 42 H 72 M 51 46.5 H 66" stroke="${BG0}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <rect x="76" y="26" width="38" height="68" rx="8" fill="none" stroke="${c}" stroke-width="1.8" opacity=".9"/>
    <path d="M 90 88 H 100" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`,
  // a flick of the wrist throws a file from the Mac to a phone
  airbridge: c => `
    <path id="abArc" d="M 22 78 Q 60 -6 98 60" fill="none"/>
    <path d="M 22 78 Q 60 -6 98 60" fill="none" stroke="${c}" stroke-opacity=".22" stroke-dasharray="3 6"/>
    <rect x="6" y="70" width="32" height="22" rx="4" fill="${BG0}" stroke="${c}" stroke-width="1.6"/><path d="M 2 96 H 42" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <rect x="88" y="56" width="20" height="36" rx="5" fill="${BG0}" stroke="${c}" stroke-width="1.6"/>
    <g transform="translate(60 100)"><rect x="-9" y="-11" width="18" height="22" rx="5" fill="none" stroke="${c}" stroke-opacity=".6" stroke-width="1.4"/><path d="M -5 -16 H 5 M -5 16 H 5" stroke="${c}" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round"/>
      <circle r="3" fill="${c}"><animate attributeName="r" values="3;9;3" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0;.9" dur="2.8s" repeatCount="indefinite"/></circle></g>
    <g>
      <animateMotion dur="2.8s" repeatCount="indefinite"><mpath href="#abArc"/></animateMotion>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="2.8s" repeatCount="indefinite"/>
      <path d="M -6 -8 H 3 L 7 -4 V 8 H -6 Z" fill="${c}"/>
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
  { key: "remotewindow", name: "Remote Window", color: "#b4e86a", sweep: 6.6, status: "LIVE", domain: "remotewindow.app",
    eyebrow: "macOS APP · WEBRTC",
    desc: "Share one Mac window, not your whole screen. A native host streams it with app audio to any phone or browser. Viewers open a link and you approve each one.",
    chips: ["Swift", "WebRTC", "TypeScript", "Signaling"] },
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
  { key: "airbridge", name: "AirBridge", color: "#6fd3e8", sweep: 7.4, status: "PROTOTYPE", domain: "open source on GitHub",
    eyebrow: "WATCH · MAC · iPHONE",
    desc: "Flick your wrist and a file leaves the Mac for a nearby iPhone. Core Motion gesture, Bonjour discovery, X25519 and AES-GCM, SHA-256 verified on arrival.",
    chips: ["Swift", "watchOS", "Core Motion", "Network.framework"] },
];

for (const p of products) writeFileSync(new URL(`card-${p.key}.svg`, OUT), card(p));

/* ------------------------------------------------------------------ */
/*  the bay: one scene generator, two times of day                     */
/*                                                                    */
/*  The banner is golden hour and the footer is dusk, the same arc    */
/*  the portfolio flies. Everything is deterministic (seeded), so the */
/*  daily Action regenerates byte-identical files and never produces  */
/*  a spurious diff.                                                  */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function scene({ H, HZ, dusk, seed, copy, strip, label }) {
  const W = 1200, r = rng(seed);
  const SX = 742;                                   // the sun sits inside the bridge span
  const f = (n) => n.toFixed(1);
  const sky = dusk
    ? [[0, "#060812"], [0.42, "#11183a"], [0.72, "#352c58"], [0.9, "#a4523e"], [1, "#f2904c"]]
    : [[0, "#18274a"], [0.34, "#454d7c"], [0.6, "#a8748c"], [0.82, "#f0a676"], [1, "#ffdca4"]];
  const sea = dusk
    ? [[0, "#7a4136"], [0.16, "#2a2440"], [0.5, "#0f1528"], [1, "#060812"]]
    : [[0, "#e0a584"], [0.14, "#6a6682"], [0.5, "#27314e"], [1, "#0b1020"]];
  const stops = (a) => a.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const far = dusk ? "#141a34" : "#6a5f84", near = dusk ? "#0b0e1e" : "#3b3856";
  const wall = dusk ? "#080a16" : "#1c1d33", wallHi = dusk ? "#0d1020" : "#2a2a45";
  const steel = dusk ? "#1d0d0c" : "#8a2f20", steelHi = dusk ? "#4a1c15" : "#d2573a";
  const lit = "#ffd28c";

  /* stars: a few at golden hour, a sky full at dusk */
  let stars = "";
  for (let i = 0, n = dusk ? 90 : 16; i < n; i++) {
    const x = r() * W, y = r() * (HZ - 70), rad = 0.5 + r() * 0.9, d = 2 + r() * 4;
    stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="#eef0ff" opacity="${f(0.25 + r() * 0.5)}">${r() < 0.4 ? `<animate attributeName="opacity" values=".15;.9;.15" dur="${f(d)}s" begin="${f(r() * 4)}s" repeatCount="indefinite"/>` : ""}</circle>`;
  }

  /* cloud bank, lit from below */
  let clouds = "";
  for (let i = 0; i < 6; i++) {
    const x = 380 + r() * 760, y = 40 + r() * (HZ - 150), w = 90 + r() * 130;
    clouds += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(6 + r() * 7)}" fill="${dusk ? "#3a2c4c" : "#ffc79a"}" opacity="${f(0.3 + r() * 0.35)}"/>`;
  }

  /* headlands: jagged ridges closing the bay on both sides */
  const ridge = (x0, x1, peak, col, jag) => {
    let d = `M ${x0} ${HZ}`;
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const u = i / n, env = Math.pow(Math.sin(u * Math.PI), 0.8);
      d += ` L ${f(x0 + (x1 - x0) * u)} ${f(HZ - env * peak * (0.7 + r() * jag))}`;
    }
    return `<path d="${d} L ${x1} ${HZ} Z" fill="${col}"/>`;
  };
  const hills = ridge(-40, 470, 82, far, 0.5) + ridge(960, 1260, 70, far, 0.5)
    + ridge(-60, 300, 52, near, 0.4) + ridge(1050, 1280, 44, near, 0.4);

  /* skylines on both shores, with lit and twinkling windows */
  let city = "", windows = "";
  const tower = (x, w, h) => {
    const y = HZ - h;
    city += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${r() < 0.5 ? wall : wallHi}"/>`;
    if (h > 46 && r() < 0.35) city += `<rect x="${f(x + w / 2 - 0.6)}" y="${f(y - 9)}" width="1.2" height="9" fill="${wall}"/>`;
    for (let wy = y + 4; wy < HZ - 4; wy += 6) {
      for (let wx = x + 2.5; wx < x + w - 3; wx += 5) {
        if (r() > (dusk ? 0.27 : 0.1)) continue;
        const tw = r() < 0.16;
        windows += `<rect x="${f(wx)}" y="${f(wy)}" width="2.4" height="3" fill="${r() < 0.82 ? lit : "#cfe0ff"}" opacity="${f(0.55 + r() * 0.45)}">${tw ? `<animate attributeName="opacity" values="1;.15;1" dur="${f(3 + r() * 6)}s" begin="${f(r() * 6)}s" repeatCount="indefinite"/>` : ""}</rect>`;
      }
    }
  };
  for (let x = 0; x < 470;) { const w = 15 + r() * 20; tower(x, w, 26 + r() * 46 + (1 - x / 470) * 44); x += w + r() * 5; }
  for (let x = 1012; x < W;) { const w = 15 + r() * 20; tower(x, w, 26 + r() * 40 + ((x - 1012) / 190) * 46); x += w + r() * 5; }
  // a far skyline through the bridge, tiny and hazy
  let farCity = "";
  for (let x = 610; x < 880;) { const w = 5 + r() * 8; farCity += `<rect x="${f(x)}" y="${f(HZ - 5 - r() * 15)}" width="${f(w)}" height="22" fill="${dusk ? "#151a36" : "#8a6f8c"}"/>`; x += w + r() * 5; }

  /* the bridge: towers, a sagging main cable, suspenders, a lit deck */
  const DY = HZ - 30, TOP = HZ - 128, X0 = 452, X1 = 1030, T0 = 594, T1 = 884;
  const cableY = (x) => {
    if (x < T0) { const u = (x - X0) / (T0 - X0); return DY + (TOP - DY) * u * u; }
    if (x > T1) { const u = (X1 - x) / (X1 - T1); return DY + (TOP - DY) * u * u; }
    const u = (x - T0) / (T1 - T0); return TOP + (DY - 12 - TOP) * 4 * u * (1 - u);
  };
  let cable = `M ${X0} ${DY}`, hang = "";
  for (let x = X0; x <= X1; x += 6) cable += ` L ${x} ${f(cableY(x))}`;
  for (let x = X0 + 12; x < X1; x += 12) hang += `M ${x} ${f(cableY(x))} V ${DY} `;
  let deckLights = "";
  for (let x = X0 + 10; x < X1; x += 20) deckLights += `<circle cx="${x}" cy="${DY - 3}" r="${dusk ? 1.5 : 1}" fill="${lit}" opacity="${dusk ? 0.95 : 0.5}"/>`;
  const towerSvg = (x) => `
      <rect x="${x - 5}" y="${TOP - 6}" width="3.6" height="${HZ - TOP + 6}" fill="${steel}"/><rect x="${x + 1.4}" y="${TOP - 6}" width="3.6" height="${HZ - TOP + 6}" fill="${steelHi}"/>
      ${[0.14, 0.4, 0.66].map((k) => `<rect x="${x - 5}" y="${f(TOP + (DY - TOP) * k)}" width="10" height="3" fill="${steel}"/>`).join("")}
      <circle cx="${x}" cy="${TOP - 10}" r="2.2" fill="#ff5a48"><animate attributeName="opacity" values="1;.1;1" dur="1.9s" begin="${x === T0 ? 0 : 0.95}s" repeatCount="indefinite"/></circle>`;
  const bridge = `
    <g id="bridge${seed}">
      <path d="${hang}" stroke="${steel}" stroke-width=".7" opacity=".85"/>
      <path d="${cable}" fill="none" stroke="${steelHi}" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="${X0}" y="${DY}" width="${X1 - X0}" height="4.5" fill="${steel}"/>
      <rect x="${X0}" y="${DY}" width="${X1 - X0}" height="1.2" fill="${steelHi}"/>
      ${towerSvg(T0)}${towerSvg(T1)}
    </g>`;
  let traffic = "";
  for (let i = 0; i < 5; i++) {
    const back = i % 2, dur = 11 + r() * 9;
    traffic += `<circle cy="${DY - 1.2}" r="1.3" fill="${back ? "#ff6a58" : "#fff3d6"}"><animate attributeName="cx" values="${back ? `${X1};${X0}` : `${X0};${X1}`}" dur="${f(dur)}s" begin="-${f(r() * dur)}s" repeatCount="indefinite"/></circle>`;
  }

  /* water: glitter path under the sun, drifting swell lines */
  let glitter = "";
  for (let i = 0; i < 46; i++) {
    const t = Math.pow(r(), 0.8), y = HZ + 4 + t * (H - HZ - 60);
    const spread = 14 + t * 150, x = SX + (r() - 0.5) * spread * 2, w = 6 + t * 30 * r();
    glitter += `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(1 + t * 1.6)}" rx="1" fill="${dusk ? "#ff9a5c" : "#ffe9c2"}" opacity="0"><animate attributeName="opacity" values="0;${f(0.35 + r() * 0.6)};0" dur="${f(1.6 + r() * 3)}s" begin="${f(r() * 4)}s" repeatCount="indefinite"/></rect>`;
  }
  let swell = "";
  for (let i = 0; i < 26; i++) {
    const t = r(), y = HZ + 10 + t * (H - HZ - 60), x = r() * W, w = 30 + t * 110;
    swell += `<path d="M ${f(x)} ${f(y)} h ${f(w)}" stroke="#ffffff" stroke-opacity="${f(0.03 + r() * 0.07)}" stroke-width="${f(0.6 + t)}"><animateTransform attributeName="transform" type="translate" values="0 0;${f(24 + t * 50)} 0;0 0" dur="${f(9 + r() * 9)}s" repeatCount="indefinite"/></path>`;
  }

  /* the floatplane: high wing, twin pontoons, crossing the sky */
  const planePath = dusk
    ? `M -120 40 C 300 26, 640 44, 900 ${HZ - 70} S 1180 ${HZ - 44}, 1340 ${HZ - 40}`
    : `M -120 58 C 240 30, 560 44, 820 ${HZ - 170} S 1140 ${HZ - 150}, 1340 ${HZ - 190}`;
  const plane = `
    <path id="fly${seed}" d="${planePath}" fill="none"/>
    <g>
      <animateMotion dur="${dusk ? 26 : 22}s" repeatCount="indefinite" rotate="auto"><mpath href="#fly${seed}"/></animateMotion>
      <g transform="scale(1.25)">
        <path d="M -150 -1 H -30" stroke="url(#trail${seed})" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M -30 -1 L -38 -14 L -29 -14 L -20 -5 Z" fill="#e8703a"/>
        <path d="M -30 0 Q -22 -8 -6 -8 L 12 -8 Q 23 -7 28 -1 L 28 2 Q 14 6 0 6 L -22 3 Z" fill="${dusk ? "#c9cbd6" : "#f6f1e8"}"/>
        <path d="M 2 -6 h 9 q 5 0 8 4 h -17 Z" fill="#1c2436"/>
        <rect x="-10" y="-12" width="26" height="3" rx="1.5" fill="#e8703a"/>
        <path d="M -2 -9 L 3 5 M 12 -9 L 9 5" stroke="${dusk ? "#8d8f9c" : "#bdb8ae"}" stroke-width="1"/>
        <path d="M -4 6 L -7 12 M 10 6 L 12 12" stroke="${dusk ? "#8d8f9c" : "#bdb8ae"}" stroke-width="1.2"/>
        <path d="M -18 12 H 18 Q 24 12 26 14 Q 24 16.5 18 16.5 H -16 Q -20 16 -18 12 Z" fill="#141826"/>
        <ellipse cx="29.5" cy="0" rx="1.1" ry="9" fill="#ffffff" opacity=".5"><animate attributeName="ry" values="9;3;9" dur=".12s" repeatCount="indefinite"/></ellipse>
        <circle cx="-31" cy="-13" r="1.6" fill="#ff5a48"><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></circle>
        <circle cx="3" cy="8" r="1.4" fill="#ffffff"><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.8;.9;1" dur="1.6s" repeatCount="indefinite"/></circle>
      </g>
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(label)}">
  <defs>
    <linearGradient id="sky${seed}" x1="0" y1="0" x2="0" y2="${HZ}" gradientUnits="userSpaceOnUse">${stops(sky)}</linearGradient>
    <linearGradient id="sea${seed}" x1="0" y1="${HZ}" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">${stops(sea)}</linearGradient>
    <radialGradient id="halo${seed}" cx="${SX}" cy="${HZ - (dusk ? -6 : 16)}" r="${dusk ? 300 : 360}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${dusk ? "#ffb070" : "#fff6dc"}" stop-opacity="${dusk ? 0.75 : 0.95}"/><stop offset=".22" stop-color="${dusk ? "#ff8a4a" : "#ffd08a"}" stop-opacity="${dusk ? 0.3 : 0.5}"/><stop offset="1" stop-color="#ff9a5c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="scrim${seed}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#080912" stop-opacity=".9"/><stop offset=".34" stop-color="#080912" stop-opacity=".74"/><stop offset=".58" stop-color="#080912" stop-opacity="0"/></linearGradient>
    <linearGradient id="fade${seed}" x1="0" y1="${HZ}" x2="0" y2="${HZ + 120}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="trail${seed}" x1="-150" y1="0" x2="-30" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
    <linearGradient id="edge${seed}" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset=".5" stop-color="${PEACH}"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-1200 0;1200 0" dur="7s" repeatCount="indefinite"/></linearGradient>
    <mask id="refl${seed}"><rect x="0" y="${HZ}" width="${W}" height="130" fill="url(#fade${seed})"/></mask>
    <filter id="soft${seed}" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
    <clipPath id="clip${seed}"><rect width="${W}" height="${H}" rx="18"/></clipPath>
  </defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}} .s{font-family:Georgia,'Times New Roman',serif;font-style:italic}
    .rise{animation:rise 1s cubic-bezier(.2,.7,.2,1) both}
    @keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    .ping{animation:ping 2.4s ease-out infinite;transform-box:fill-box;transform-origin:center}
    @keyframes ping{0%{opacity:.8;transform:scale(1)}80%,100%{opacity:0;transform:scale(3.2)}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <g clip-path="url(#clip${seed})">
    <rect width="${W}" height="${HZ}" fill="url(#sky${seed})"/>
    ${stars}
    <rect width="${W}" height="${HZ}" fill="url(#halo${seed})"/>
    ${dusk ? "" : `<circle cx="${SX}" cy="${HZ - 16}" r="19" fill="#fffaf0"><animate attributeName="r" values="19;20.5;19" dur="5s" repeatCount="indefinite"/></circle>`}
    <g filter="url(#soft${seed})">${clouds}<animateTransform attributeName="transform" type="translate" values="0 0;46 0;0 0" dur="60s" repeatCount="indefinite"/></g>
    ${farCity}
    ${hills}
    <rect y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#sea${seed})"/>
    <rect y="${HZ}" width="${W}" height="${H - HZ}" fill="url(#halo${seed})" opacity=".55"/>
    <g id="city${seed}">${city}</g>
    <g>${windows}</g>
    ${bridge}
    ${deckLights}${traffic}
    <g mask="url(#refl${seed})" opacity="${dusk ? 0.55 : 0.4}">
      <use href="#city${seed}" transform="translate(0 ${2 * HZ}) scale(1 -1)"/>
      <use href="#bridge${seed}" transform="translate(0 ${2 * HZ}) scale(1 -1)"/>
    </g>
    ${swell}
    ${glitter}
    <rect width="${W}" height="${H}" fill="url(#scrim${seed})"/>
    ${plane}
    ${copy}
    ${strip}
  </g>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="17.5" fill="none" stroke="${INK}" stroke-opacity=".1" stroke-width="1.5"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="17.5" fill="none" stroke="url(#edge${seed})" stroke-width="1.5" opacity=".7"/>
</svg>
`;
}

/* the instrument strip along the bottom edge, same as the portfolio's */
const instruments = (H, sector, line, gauges) => `
    <rect y="${H - 38}" width="1200" height="38" fill="#080912" opacity=".86"/>
    <path d="M 0 ${H - 38} H 1200" stroke="${INK}" stroke-opacity=".1"/>
    <text class="m" x="36" y="${H - 14}" font-size="11.5" letter-spacing="2.2" fill="${PEACH}">${esc(sector)}</text>
    <text class="m" x="232" y="${H - 14}" font-size="11.5" letter-spacing="2.2" fill="${DIM}">${esc(line)}</text>
    <text class="m" x="1164" y="${H - 14}" text-anchor="end" font-size="11.5" letter-spacing="2.2" fill="${DIM}" xml:space="preserve">${esc(gauges)}</text>`;

function banner() {
  const H = 440;
  // four lines that take turns under the headline. keyTimes must end at 1.
  const rotating = [
    "RAG PIPELINES · AGENTIC WORKFLOWS · SEMANTIC SEARCH",
    "SIX PRODUCTS SHIPPED, FIVE ON THEIR OWN DOMAINS",
    "PYTHON · TYPESCRIPT · SWIFT · JAVA",
    "37.77° N, 122.42° W · OPEN TO RELOCATE",
  ];
  const copy = `
    <g class="rise" style="animation-delay:.1s">
      <circle class="ping" cx="70" cy="92" r="4" fill="#39d353"/><circle cx="70" cy="92" r="4" fill="#39d353"/>
      <text class="m" x="86" y="96.5" font-size="13" letter-spacing="3.4" fill="${PEACH}">AI ENGINEER · PAYPAL · SAN FRANCISCO</text>
    </g>
    <g class="rise" style="animation-delay:.25s">
      <text class="t" x="60" y="186" font-size="86" font-weight="800" letter-spacing="-2.6" fill="${INK}">Manan Shah</text>
    </g>
    <g class="rise" style="animation-delay:.45s">
      <text class="t" x="64" y="240" font-size="27" font-weight="500" fill="${INK}">Building <tspan class="s" fill="${PEACH}" font-size="31" font-weight="400">LLM systems</tspan> that hold up in production.</text>
    </g>
    <g class="rise" style="animation-delay:.65s">
      <path d="M 64 272 H 104" stroke="${PEACH}" stroke-width="2" stroke-linecap="round"/>
      ${rotating.map((t, i) => `<text class="m" x="118" y="276.5" font-size="12.5" letter-spacing="2.4" fill="${INK}" opacity="0">${esc(t)}<animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.03;.22;.25;1" dur="16s" begin="${i * 4}s" repeatCount="indefinite"/></text>`).join("\n      ")}
    </g>`;
  return scene({
    H, HZ: 300, dusk: false, seed: 4242, copy,
    strip: instruments(H, "01 — TAKEOFF", "WHEELS UP OVER THE BAY. GOLDEN HOUR, CLEAR SKIES.", "ALT 1770 FT   SPD 168 KT"),
    label: "Manan Shah. AI Engineer at PayPal in San Francisco. Building LLM systems that hold up in production. An animated bay at golden hour: the sun setting through a suspension bridge, a skyline, and a floatplane crossing the sky.",
  });
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
    ["kv", "shipping", "DialDo · Repo Run · Remote Window · TrailMail · GitPixelPush · Relay (App Store)"],
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
/*  divider: a flight path with a plane on it                          */
/* ------------------------------------------------------------------ */
writeFileSync(new URL("divider.svg", OUT), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 28" width="1200" height="28" role="presentation">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset=".5" stop-color="${PEACH}" stop-opacity=".5"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/></linearGradient></defs>
  <path d="M 0 14 H 1200" stroke="url(#g)" stroke-dasharray="2 7"/>
  <g>
    <animateTransform attributeName="transform" type="translate" values="-40 14;1240 14" dur="14s" repeatCount="indefinite"/>
    <path d="M -46 0 H -12" stroke="${PEACH}" stroke-opacity=".5" stroke-linecap="round"/>
    <path d="M -10 0 L -14 -6 L -10 -6 L -5 -2 L 6 -2 Q 11 -2 12 0 Q 11 2 6 2 L -8 2 Z" fill="${PEACH}"/>
    <rect x="-3" y="-5" width="10" height="1.6" rx=".8" fill="${PEACH}"/>
    <rect x="-6" y="4.4" width="14" height="1.8" rx=".9" fill="${PEACH}" opacity=".8"/>
  </g>
</svg>
`);

/* ------------------------------------------------------------------ */
/*  footer: the same bay, an hour later                                */
/* ------------------------------------------------------------------ */
writeFileSync(new URL("footer.svg", OUT), scene({
  H: 300, HZ: 196, dusk: true, seed: 9001,
  copy: `
    <g class="rise" style="animation-delay:.2s">
      <text class="m" x="64" y="84" font-size="12.5" letter-spacing="3.2" fill="${PEACH}">THE PART WHERE YOU SAY HELLO</text>
      <text class="t" x="60" y="140" font-size="46" font-weight="800" letter-spacing="-1.2" fill="${INK}">Thanks for <tspan class="s" fill="${PEACH}" font-weight="400" font-size="50">flying by.</tspan></text>
      <text class="t" x="64" y="176" font-size="17" fill="${INK}" opacity=".82">Ambiguous problem in, working system out.</text>
    </g>`,
  strip: instruments(300, "09 — LANDING", "FINAL APPROACH AT DUSK. SEND THE EMAIL, BRING HER HOME.", "ALT 0650 FT   SPD 168 KT"),
  label: "Thanks for flying by. The same bay at dusk: city lights on, the bridge in silhouette against the afterglow, the floatplane on final approach.",
}));

/* ------------------------------------------------------------------ */
/*  link buttons: one small SVG each, so each can be its own anchor    */
/* ------------------------------------------------------------------ */
const glyphs = {
  portfolio: `<path d="M -8 5 L 0 -8 L 8 5 L 0 1.5 Z" fill="currentColor"/>`,
  linkedin: `<rect x="-8" y="-8" width="16" height="16" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M -4 -1 V 4 M -4 -4.4 V -4.2 M 0 4 V -1 M 0 1 Q 0 -1.4 2.2 -1.4 Q 4.4 -1.4 4.4 1 V 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  email: `<rect x="-9" y="-6.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M -8 -5 L 0 1.5 L 8 -5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
  resume: `<path d="M -6 -9 H 3 L 7 -5 V 9 H -6 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M -2.5 -1 H 3.5 M -2.5 3.5 H 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
};
function button(key, text, primary) {
  const W = Math.round(text.length * 11.4 + 86), H = 52;
  const fg = primary ? "#1a120a" : INK;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(text)}">
  <defs><linearGradient id="e" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${primary ? 0.55 : 0.85}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    <animateTransform attributeName="gradientTransform" type="translate" values="-${W} 0;${W} 0" dur="3.6s" repeatCount="indefinite"/></linearGradient></defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${H / 2 - 1}" fill="${primary ? PEACH : BG0}" stroke="${primary ? PEACH : INK}" stroke-opacity="${primary ? 1 : 0.22}" stroke-width="1.5"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${H / 2 - 1}" fill="none" stroke="url(#e)" stroke-width="1.5"/>
  <g transform="translate(34 26)" color="${primary ? "#1a120a" : PEACH}">${glyphs[key]}</g>
  <text x="56" y="31" font-family="${MONO}" font-size="14" font-weight="600" letter-spacing="2.6" fill="${fg}">${esc(text)}</text>
</svg>
`;
}
for (const [key, text, primary] of [["portfolio", "PORTFOLIO", true], ["linkedin", "LINKEDIN"], ["email", "EMAIL"], ["resume", "RÉSUMÉ"]]) {
  writeFileSync(new URL(`btn-${key}.svg`, OUT), button(key, text, primary));
}

/* ------------------------------------------------------------------ */
/*  section headers: numbered, on their own dark bar so they read the  */
/*  same on GitHub's light and dark themes                             */
/* ------------------------------------------------------------------ */
function header(n, title, note) {
  const W = 1200, H = 76;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${BG1}"/><stop offset="1" stop-color="${BG0}"/></linearGradient>
    <linearGradient id="e" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${PEACH}" stop-opacity="0"/><stop offset=".5" stop-color="${PEACH}"/><stop offset="1" stop-color="${PEACH}" stop-opacity="0"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-1200 0;1200 0" dur="6s" repeatCount="indefinite"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  <path d="M 30 ${H - 1} H ${W - 30}" stroke="url(#e)" stroke-width="1.5"/>
  <text x="34" y="46" font-family="${MONO}" font-size="14" letter-spacing="3" fill="${PEACH}">${n}</text>
  <text x="80" y="50" font-family="${SANS}" font-size="32" font-weight="800" letter-spacing="-.6" fill="${INK}">${esc(title)}</text>
  <text x="${W - 34}" y="46" text-anchor="end" font-family="${MONO}" font-size="12" letter-spacing="2.6" fill="${DIM}">${esc(note)}</text>
</svg>
`;
}
for (const [slug, n, title, note] of [
  ["shipped", "01", "Shipped", "LIVE, USED BY STRANGERS, MAINTAINED"],
  ["live", "02", "Live from the workbench", "REGENERATED DAILY BY AN ACTION"],
  ["stack", "03", "The stack", "TOOLS ARE TEMPORARY. SYSTEMS THINKING ISN'T."],
  ["path", "04", "Where I have been", "FINTECH, WITH ENTERPRISE INSURANCE BEFORE IT"],
  ["graph", "05", "The graph, eaten", "PAINTED WITH GITPIXELPUSH"],
]) writeFileSync(new URL(`h-${slug}.svg`, OUT), header(n, title, note));

/* ------------------------------------------------------------------ */
/*  the stack: one panel, four columns, no third-party icon service    */
/* ------------------------------------------------------------------ */
function stack() {
  const W = 1200, COLW = 264, X0 = 36, GAP = 24;
  const cols = [
    ["GENERATIVE AI", PEACH, ["RAG", "AI agents", "Tool calling", "MCP", "Embeddings", "Semantic search", "Prompt engineering", "LLM evaluation"]],
    ["AI PLATFORMS + DATA", "#c49bff", ["Amazon Bedrock", "LangChain", "LangGraph", "OpenAI API", "Anthropic Claude", "Hugging Face", "Pinecone", "ChromaDB", "PostgreSQL", "MongoDB", "Redis"]],
    ["LANGUAGES + BACKEND", "#8ab4ff", ["Python", "TypeScript", "Java 17", "Swift", "JavaScript", "SQL", "FastAPI", "Spring Boot", "Node.js", "REST APIs", "Microservices", "Apache Kafka"]],
    ["CLOUD + SHIPPING", "#8fd3a8", ["AWS", "EKS", "Lambda", "Docker", "Kubernetes", "GitHub Actions", "Cloudflare Workers", "Electron", "WebRTC", "Chrome MV3", "Code signing"]],
  ];
  let maxY = 0;
  const body = cols.map(([title, color, items], ci) => {
    const x0 = X0 + ci * (COLW + GAP);
    let x = 0, y = 0, chips = "";
    items.forEach((t, i) => {
      const w = Math.round(t.length * 7.5 + 24);
      if (x + w > COLW) { x = 0; y += 34; }
      chips += `<g transform="translate(${x} ${y})" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".5s" begin="${(0.2 + ci * 0.18 + i * 0.05).toFixed(2)}s" fill="freeze"/>
        <rect width="${w}" height="26" rx="13" fill="${color}" fill-opacity=".08" stroke="${color}" stroke-opacity=".3"/><text x="${w / 2}" y="17.5" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${INK}" opacity=".9">${esc(t)}</text></g>`;
      x += w + 8;
    });
    maxY = Math.max(maxY, y);
    return `<g transform="translate(${x0} 40)">
      <circle cx="5" cy="5" r="4" fill="${color}"><animate attributeName="opacity" values="1;.3;1" dur="${2.4 + ci * 0.4}s" repeatCount="indefinite"/></circle>
      <text x="18" y="9.5" font-family="${MONO}" font-size="12" letter-spacing="2.4" fill="${color}">${esc(title)}</text>
      <path d="M 0 26 H ${COLW}" stroke="${color}" stroke-opacity=".22"/>
      <g transform="translate(0 44)">${chips}</g>
    </g>`;
  }).join("\n  ");
  const H = 40 + 44 + maxY + 26 + 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Stack. ${cols.map(([t, , items]) => `${t}: ${items.join(", ")}`).join(". ")}.">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  ${body}
</svg>
`;
}
writeFileSync(new URL("stack.svg", OUT), stack());
