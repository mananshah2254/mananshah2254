// Builds the live cards (shipping log + languages) from the GitHub GraphQL API.
// Run by .github/workflows/refresh.yml every day; locally:
//   GITHUB_TOKEN=$(gh auth token) node scripts/live.mjs
// Self-hosted on purpose: the public stats services this profile used to
// embed now return 402/503 and render as broken images.
import { writeFileSync, mkdirSync } from "node:fs";

const USER = process.env.PROFILE_USER || "mananshah2254";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!TOKEN) { console.error("GITHUB_TOKEN is required"); process.exit(1); }

const OUT = new URL("../assets/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const BG0 = "#0a0b16", BG1 = "#11132a", PEACH = "#ffab70", INK = "#f7f5f0", DIM = "#a9a4b8";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

// Repos that are art or meta, not engineering work
const SKIP = new Set([USER, "pixel-canvas"]);
// Markup and styling would otherwise outrank the actual code
const SKIP_LANG = new Set(["HTML", "CSS", "SCSS", "Jupyter Notebook"]);
const ACTIVE_SINCE = "2025-01-01T00:00:00Z";

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": "profile-cards" },
  body: JSON.stringify({ query: `query($login:String!){ user(login:$login){
    repositories(first:60, ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC, orderBy:{field:PUSHED_AT, direction:DESC}){
      nodes{ name pushedAt
        languages(first:8, orderBy:{field:SIZE, direction:DESC}){ edges{ size node{ name color } } }
        defaultBranchRef{ target{ ... on Commit{ history(first:1){ nodes{ messageHeadline committedDate } } } } }
      } } } }`, variables: { login: USER } }),
});
const json = await res.json();
if (!json.data) { console.error(JSON.stringify(json)); process.exit(1); }
const repos = json.data.user.repositories.nodes.filter(r => !SKIP.has(r.name));

/* ---------------- shipping log ---------------- */
const fmt = d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).toUpperCase();
const log = repos
  .map(r => ({ repo: r.name, c: r.defaultBranchRef?.target?.history?.nodes?.[0] }))
  .filter(x => x.c)
  .sort((a, b) => b.c.committedDate.localeCompare(a.c.committedDate))
  .slice(0, 6);

const W = 590, rowH = 44, top = 70;
const H = top + log.length * rowH + 30;
const updated = new Date().toISOString().slice(0, 10);

const logSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Recent commits: ${esc(log.map(l => l.repo + ": " + l.c.messageHeadline).join("; "))}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/></linearGradient></defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}}
    .row{animation:row .6s cubic-bezier(.2,.7,.2,1) both}
    @keyframes row{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
    .pulse{animation:pulse 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  <text class="m" x="26" y="38" font-size="12" letter-spacing="2.4" fill="${PEACH}">SHIPPING LOG</text>
  <circle class="pulse" cx="${W - 168}" cy="34" r="4" fill="#39d353"/>
  <text class="m" x="${W - 26}" y="38" text-anchor="end" font-size="11" fill="${DIM}">updated ${updated}</text>
  <path d="M 36 ${top} V ${top + (log.length - 1) * rowH}" stroke="${INK}" stroke-opacity=".1" stroke-width="2"/>
  ${log.map((l, i) => {
    const y = top + i * rowH;
    return `<g class="row" style="animation-delay:${(0.15 + i * 0.12).toFixed(2)}s">
    <circle cx="36" cy="${y}" r="5" fill="${BG0}" stroke="${i === 0 ? "#39d353" : PEACH}" stroke-width="2"/>
    <text class="m" x="56" y="${y - 4}" font-size="12.5" font-weight="600" fill="${INK}">${esc(l.repo)}</text>
    <text class="m" x="${W - 26}" y="${y - 4}" text-anchor="end" font-size="11" fill="${DIM}">${fmt(l.c.committedDate)}</text>
    <text class="t" x="56" y="${y + 14}" font-size="12.5" fill="${DIM}">${esc(clip(l.c.messageHeadline, 70))}</text>
  </g>`;
  }).join("\n  ")}
</svg>
`;
writeFileSync(new URL("activity.svg", OUT), logSvg);

/* ---------------- languages ---------------- */
const sizes = {}, colors = {};
for (const r of repos) {
  if (r.pushedAt < ACTIVE_SINCE) continue;
  for (const e of r.languages.edges) {
    if (SKIP_LANG.has(e.node.name)) continue;
    sizes[e.node.name] = (sizes[e.node.name] || 0) + e.size;
    colors[e.node.name] = e.node.color || DIM;
  }
}
const total = Object.values(sizes).reduce((a, b) => a + b, 0) || 1;
let langs = Object.entries(sizes).sort((a, b) => b[1] - a[1]).map(([n, s]) => ({ n, p: (s / total) * 100, c: colors[n] }));
if (langs.length > 6) {
  const rest = langs.slice(5).reduce((a, l) => a + l.p, 0);
  langs = [...langs.slice(0, 5), { n: "Other", p: rest, c: "#57536a" }];
}

const LH = H; // match the shipping log height so the pair sits flush
let bx = 26;
const barW = W - 52;
const segs = langs.map((l, i) => {
  const w = Math.max(2, (l.p / 100) * barW);
  const s = `<rect x="${bx.toFixed(1)}" y="64" width="${w.toFixed(1)}" height="12" fill="${l.c}"><animate attributeName="width" from="0" to="${w.toFixed(1)}" dur=".9s" begin="${(0.2 + i * 0.12).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines=".2 .7 .2 1" keyTimes="0;1"/><set attributeName="width" to="0" begin="0s"/></rect>`;
  bx += w;
  return s;
}).join("");
const rowsY = 112, gap = (LH - rowsY - 26) / langs.length;
const langSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${LH}" width="${W}" height="${LH}" role="img" aria-label="Languages in repositories active since 2025: ${esc(langs.map(l => `${l.n} ${l.p.toFixed(1)}%`).join(", "))}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG0}"/><stop offset="1" stop-color="${BG1}"/></linearGradient>
    <clipPath id="bar"><rect x="26" y="64" width="${barW}" height="12" rx="6"/></clipPath>
  </defs>
  <style>
    .t{font-family:${SANS}} .m{font-family:${MONO}}
    .row{animation:row .6s cubic-bezier(.2,.7,.2,1) both}
    @keyframes row{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    @media (prefers-reduced-motion: reduce){*{animation:none!important}}
  </style>
  <rect width="${W}" height="${LH}" rx="16" fill="url(#bg)"/>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${LH - 1.5}" rx="15.5" fill="none" stroke="${INK}" stroke-opacity=".09" stroke-width="1.5"/>
  <text class="m" x="26" y="38" font-size="12" letter-spacing="2.4" fill="${PEACH}">LANGUAGES</text>
  <text class="m" x="${W - 26}" y="38" text-anchor="end" font-size="11" fill="${DIM}">repos active since 2025 · code only</text>
  <rect x="26" y="64" width="${barW}" height="12" rx="6" fill="${INK}" fill-opacity=".06"/>
  <g clip-path="url(#bar)">${segs}</g>
  ${langs.map((l, i) => {
    const y = rowsY + i * gap, w = (l.p / 100) * 300;
    return `<g class="row" style="animation-delay:${(0.4 + i * 0.1).toFixed(2)}s">
    <circle cx="32" cy="${y.toFixed(1)}" r="5" fill="${l.c}"/>
    <text class="t" x="46" y="${(y + 4.5).toFixed(1)}" font-size="13.5" fill="${INK}">${esc(l.n)}</text>
    <rect x="200" y="${(y - 3).toFixed(1)}" width="300" height="6" rx="3" fill="${INK}" fill-opacity=".06"/>
    <rect x="200" y="${(y - 3).toFixed(1)}" width="${w.toFixed(1)}" height="6" rx="3" fill="${l.c}" opacity=".85"/>
    <text class="m" x="${W - 26}" y="${(y + 4.5).toFixed(1)}" text-anchor="end" font-size="12" fill="${DIM}">${l.p.toFixed(1)}%</text>
  </g>`;
  }).join("\n  ")}
</svg>
`;
writeFileSync(new URL("languages.svg", OUT), langSvg);

console.log("activity:", log.map(l => l.repo).join(", "));
console.log("languages:", langs.map(l => `${l.n} ${l.p.toFixed(1)}%`).join(", "));
