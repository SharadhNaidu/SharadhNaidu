import { DurableObject } from "cloudflare:workers";
import { NUM_FONT, LABEL_FONT } from "./font.js";

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

// jharokha arch: ogee point, square collar, round bulb. centred on 0,0, 100 tall, 84 wide
const ARCH =
  "M0 -50C1.2 -41 6 -33.5 15.5 -31.6Q17 -31.3 17 -29.8L17 -26.2" +
  "C32 -25 42 -14 42 0C42 14 32 25 17 26.2L17 29.8Q17 31.3 15.5 31.6" +
  "C6 33.5 1.2 41 0 50" +
  "C-1.2 41 -6 33.5 -15.5 31.6Q-17 31.3 -17 29.8L-17 26.2" +
  "C-32 25 -42 14 -42 0C-42 -14 -32 -25 -17 -26.2L-17 -29.8Q-17 -31.3 -15.5 -31.6" +
  "C-6 -33.5 -1.2 -41 0 -50Z";

// Poppins advance widths (units per em = 1000)
const NUM_ADV = { 0: 646, 1: 362, 2: 574, 3: 599, 4: 661, 5: 644, 6: 640, 7: 548, 8: 643, 9: 626, ",": 254 };
const LABEL = "profile views";
const LABEL_ADV = 6253; // Poppins Medium, "profile views"

const H = 64;
const NUM_SIZE = 24;
const LABEL_SIZE = 13;
const BASE = 41; // shared baseline
const X0 = 62; // text start, after the icon
const EASE = "0.23 1 0.32 1";

function number(n) {
  const s = n.toLocaleString("en-IN");
  let x = X0;
  let i = 0;
  const out = [];
  for (const ch of s) {
    const w = (NUM_ADV[ch] * NUM_SIZE) / 1000;
    const begin = (0.25 + i * 0.045).toFixed(3);
    out.push(
      `<text x="${x.toFixed(2)}" y="${BASE}" class="n" opacity="0">${ch}` +
        `<animate attributeName="opacity" values="0;1" dur="0.5s" begin="${begin}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="${EASE}"/>` +
        `<animateTransform attributeName="transform" type="translate" values="0 14;0 0" dur="0.6s" begin="${begin}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="${EASE}"/>` +
        `</text>`
    );
    x += w;
    i++;
  }
  return { svg: out.join(""), end: x, steps: i };
}

function render(n) {
  const num = number(n);
  const labelX = num.end + 7;
  const W = Math.ceil(labelX + (LABEL_ADV * LABEL_SIZE) / 1000 + 20);
  const labelAt = (0.3 + num.steps * 0.045).toFixed(3);
  const aria = `${n.toLocaleString("en-IN")} profile ${n === 1 ? "view" : "views"}`;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${aria}">
<title>${aria}</title>
<defs>
<style>
@font-face{font-family:"PN";font-weight:600;src:url(data:font/woff2;base64,${NUM_FONT}) format("woff2")}
@font-face{font-family:"PL";font-weight:500;src:url(data:font/woff2;base64,${LABEL_FONT}) format("woff2")}
.n{font-family:"PN",Poppins,"Segoe UI",sans-serif;font-weight:600;font-size:${NUM_SIZE}px;fill:#f3f6fd}
.l{font-family:"PL",Poppins,"Segoe UI",sans-serif;font-weight:500;font-size:${LABEL_SIZE}px;fill:#8aa9d6}
</style>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1e4a"/><stop offset="1" stop-color="#0d295e"/></linearGradient>
<linearGradient id="clay" x1="0" y1="-50" x2="0" y2="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#EE7A3A"/><stop offset="1" stop-color="#E05A1E"/></linearGradient>
<radialGradient id="lamp" cx="0" cy="3" r="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F4B8CC"/><stop offset="0.55" stop-color="#F09AA6" stop-opacity="0.7"/><stop offset="1" stop-color="#EE8C8C" stop-opacity="0"/></radialGradient>
<clipPath id="arch"><path d="${ARCH}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" rx="12" fill="url(#bg)"/>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="11.5" fill="none" stroke="#fff" stroke-opacity="0.07"/>
<g transform="translate(34 32)">
<g opacity="0">
<animate attributeName="opacity" values="0;1" dur="0.45s" begin="0.05s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="${EASE}"/>
<animateTransform attributeName="transform" type="translate" values="0 5;0 0" dur="0.6s" begin="0.05s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="${EASE}"/>
<g transform="scale(0.4)">
<path d="${ARCH}" fill="url(#clay)"/>
<g clip-path="url(#arch)"><circle r="44" cy="3" fill="url(#lamp)" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.9s" begin="0.45s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/></circle></g>
</g>
</g>
</g>
${num.svg}
<text x="${labelX.toFixed(2)}" y="${BASE}" class="l" opacity="0">${LABEL}<animate attributeName="opacity" values="0;1" dur="0.5s" begin="${labelAt}s" fill="freeze"/></text>
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
