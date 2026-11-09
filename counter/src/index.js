import { DurableObject } from "cloudflare:workers";
import { POPPINS } from "./font.js";

// one durable counter, so increments are exact and ordered
export class Counter extends DurableObject {
  async hit() {
    const n = ((await this.ctx.storage.get("n")) ?? 0) + 1;
    await this.ctx.storage.put("n", n);
    return n;
  }
  async peek() {
    return (await this.ctx.storage.get("n")) ?? 0;
  }
}

// jharokha / ogee-arch lantern, centred on 0,0, about 100 units tall
const ARCH =
  "M0 -50C1.5 -42 7 -34.5 19 -32.5Q22 -32 22 -29L22 -25.5" +
  "C38 -25 50 -14 50 0C50 14 38 25 22 25.5L22 29Q22 32 19 32.5" +
  "C7 34.5 1.5 42 0 50" +
  "C-1.5 42 -7 34.5 -19 32.5Q-22 32 -22 29L-22 25.5" +
  "C-38 25 -50 14 -50 0C-50 -14 -38 -25 -22 -25.5L-22 -29Q-22 -32 -19 -32.5" +
  "C-7 -34.5 -1.5 -42 0 -50Z";

const MIN_DIGITS = 5;
const CELL_W = 23;
const CELL_H = 40;
const BASE_Y = 66; // digit baseline
const TX = 84; // text column start
const EASE = "0.2 0.75 0.15 1";

function odometer(n) {
  const s = String(n).padStart(MIN_DIGITS, "0");
  const lead = s.length - String(n).length;
  const cols = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    const cx = TX + i * CELL_W + CELL_W / 2;
    if (i < lead) {
      cols.push(`<text x="${cx}" y="${BASE_Y}" class="d" opacity="0.22">0</text>`);
      continue;
    }
    // digits further right spin more turns, like a mechanical counter
    const target = (1 + (s.length - 1 - i)) * 10 + d;
    let strip = "";
    for (let k = 0; k <= target; k++) {
      strip += `<text x="${cx}" y="${BASE_Y + k * CELL_H}" class="d">${k % 10}</text>`;
    }
    const begin = (0.45 + (i - lead) * 0.09).toFixed(2);
    cols.push(
      `<g>${strip}<animateTransform attributeName="transform" type="translate" values="0 0;0 ${-target * CELL_H}" ` +
        `dur="1.7s" begin="${begin}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="${EASE}"/></g>`
    );
  }
  return { svg: cols.join(""), width: s.length * CELL_W };
}

function render(n) {
  const odo = odometer(n);
  const W = Math.max(250, TX + odo.width + 26);
  const H = 84;
  const label = `${n.toLocaleString("en-IN")} profile ${n === 1 ? "view" : "views"}`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
<title>${label}</title>
<defs>
<style>
@font-face{font-family:"P";font-weight:800;src:url(data:font/woff2;base64,${POPPINS}) format("woff2")}
.d{font-family:"P",Poppins,"Segoe UI",sans-serif;font-weight:800;font-size:34px;fill:#fff;text-anchor:middle}
.l{font-family:"P",Poppins,"Segoe UI",sans-serif;font-weight:800;font-size:10px;letter-spacing:3px;fill:#8fb8ec}
</style>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1e4a"/><stop offset="1" stop-color="#0d295e"/></linearGradient>
<radialGradient id="lamp" cx="0" cy="6" r="56" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#EFABC5"><animate attributeName="stop-color" values="#EFABC5;#F7C6D8;#EFABC5" dur="3.2s" repeatCount="indefinite"/></stop>
<stop offset="0.45" stop-color="#EE9A9A"/>
<stop offset="1" stop-color="#E6651B"/>
</radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#F0A07A" stop-opacity="0.5"/><stop offset="1" stop-color="#F0A07A" stop-opacity="0"/></radialGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="inset" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="5"/><feGaussianBlur stdDeviation="5"/>
<feComposite in2="a" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix values="0 0 0 0 1 0 0 0 0 0.86 0 0 0 0 0.9 0 0 0 0.55 0"/>
<feBlend in2="SourceGraphic"/>
</filter>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<clipPath id="win"><rect x="${TX - 3}" y="${BASE_Y - 34}" width="${odo.width + 6}" height="${CELL_H - 1}"/></clipPath>
<clipPath id="card"><rect width="${W}" height="${H}" rx="14"/></clipPath>
</defs>
<g clip-path="url(#card)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g transform="translate(42 42)">
<circle r="36" fill="url(#halo)"><animate attributeName="opacity" values="0.45;1;0.45" dur="3.2s" repeatCount="indefinite"/></circle>
<g opacity="0">
<animate attributeName="opacity" values="0;1" dur="0.5s" begin="0.1s" fill="freeze"/>
<animateTransform attributeName="transform" type="translate" values="0 10;0 0" dur="0.8s" begin="0.1s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.8 0.2 1"/>
<g>
<animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="4s" begin="0.9s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>
<path d="${ARCH}" transform="scale(0.6)" fill="url(#lamp)" filter="url(#inset)"/>
</g>
</g>
</g>
<text x="${TX}" y="25" class="l">PROFILE · VIEWS</text>
<g clip-path="url(#win)" filter="url(#glow)">${odo.svg}</g>
<rect x="-160" y="0" width="120" height="${H}" fill="url(#sheen)" transform="skewX(-18)">
<animate id="sw" attributeName="x" values="-160;${W + 120}" dur="1.3s" begin="2.4s;sw.end+6s"/>
</rect>
</g>
</svg>`;
}

const HEADERS = {
  "content-type": "image/svg+xml; charset=utf-8",
  // camo (GitHub's image proxy) must refetch on every view or the count freezes
  "cache-control": "no-cache, no-store, must-revalidate, max-age=0",
  pragma: "no-cache",
  expires: "0",
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname !== "/views.svg") return new Response("not found", { status: 404 });
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("method not allowed", { status: 405 });
    }
    const stub = env.COUNTER.get(env.COUNTER.idFromName("sharadh-profile"));
    const n = request.method === "GET" ? await stub.hit() : await stub.peek();
    return new Response(request.method === "HEAD" ? null : render(n), { headers: HEADERS });
  },
};
