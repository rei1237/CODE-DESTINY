const FLOWER_SLUG_MAP: Record<string, string> = {
  peony: "flower-peony",
  rose: "flower-rose",
  lotus: "flower-lotus",
  camellia: "flower-camellia",
  chrysanthemum: "flower-chrysanthemum",
  orchid: "flower-orchid",
  lily: "flower-lily",
  edelweiss: "flower-edelweiss",
  magnolia: "flower-magnolia",
  sunflower: "flower-sunflower",
  hydrangea: "flower-hydrangea",
  lavender: "flower-lavender",
  plum: "flower-plum",
  tulip: "flower-tulip",
  daisy: "flower-daisy",
  narcissus: "flower-narcissus",
};

const FLOWER_IMAGE_MAP: Record<string, string[]> = Object.fromEntries(
  Object.entries(FLOWER_SLUG_MAP).map(([flowerId, slug]) => [
    flowerId,
    [
      `/assets/flower/${slug}.webp`,
      `/assets/flower/${slug}.png`,
      `/fuctionassets/${slug}.webp`,
      `/fuctionassets/${slug}.png`,
    ],
  ]),
);

const FLOWER_LABEL_MAP: Record<string, string> = {
  peony: "모란",
  rose: "장미",
  lotus: "연꽃",
  camellia: "동백",
  chrysanthemum: "국화",
  orchid: "난초",
  lily: "백합",
  edelweiss: "에델바이스",
  magnolia: "목련",
  sunflower: "해바라기",
  hydrangea: "수국",
  lavender: "라벤더",
  plum: "매화",
  tulip: "튤립",
  daisy: "데이지",
  narcissus: "수선화",
};

const flowerSvgCache = new Map<string, string>();
const tarotSvgCache = new Map<string, string>();

function hashHue(seed: string, offset = 0): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 33 + seed.charCodeAt(index)) >>> 0;
  }
  return (hash + offset) % 360;
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildFlowerFallbackSvg(flowerId: string): string {
  const cacheHit = flowerSvgCache.get(flowerId);
  if (cacheHit) return cacheHit;

  const label = FLOWER_LABEL_MAP[flowerId] || "운명꽃";
  const hueA = hashHue(flowerId, 35);
  const hueB = hashHue(flowerId, 190);
  const hueC = hashHue(flowerId, 280);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hueA} 88% 92%)"/>
      <stop offset="55%" stop-color="hsl(${hueB} 90% 86%)"/>
      <stop offset="100%" stop-color="hsl(${hueC} 86% 82%)"/>
    </linearGradient>
    <radialGradient id="petal" cx="50%" cy="40%" r="56%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.18)"/>
    </radialGradient>
  </defs>
  <rect width="720" height="720" rx="52" fill="url(#bg)"/>
  <g transform="translate(360 320)">
    <g fill="url(#petal)">
      <ellipse rx="82" ry="176" transform="rotate(0)"/>
      <ellipse rx="82" ry="176" transform="rotate(30)"/>
      <ellipse rx="82" ry="176" transform="rotate(60)"/>
      <ellipse rx="82" ry="176" transform="rotate(90)"/>
      <ellipse rx="82" ry="176" transform="rotate(120)"/>
      <ellipse rx="82" ry="176" transform="rotate(150)"/>
    </g>
    <circle r="58" fill="rgba(255,248,206,0.92)"/>
  </g>
  <text x="360" y="625" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="56" font-weight="700" fill="rgba(60,35,86,0.88)">${label}</text>
</svg>`;

  const dataUrl = svgToDataUrl(svg);
  flowerSvgCache.set(flowerId, dataUrl);
  return dataUrl;
}

export function getTarotCardImage(cardId: string, cardName: string): string {
  const cacheKey = `${cardId}:${cardName}`;
  const cacheHit = tarotSvgCache.get(cacheKey);
  if (cacheHit) return cacheHit;

  const hueA = hashHue(cardId, 20);
  const hueB = hashHue(cardId, 155);
  const hueC = hashHue(cardId, 290);
  const title = String(cardName || "Card").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="760" viewBox="0 0 512 760">
  <defs>
    <linearGradient id="tarot-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hueA} 62% 20%)"/>
      <stop offset="55%" stop-color="hsl(${hueB} 65% 28%)"/>
      <stop offset="100%" stop-color="hsl(${hueC} 58% 22%)"/>
    </linearGradient>
  </defs>
  <rect width="512" height="760" rx="34" fill="url(#tarot-bg)"/>
  <g opacity="0.9" stroke="rgba(255,237,188,0.72)" fill="none">
    <circle cx="256" cy="290" r="148" stroke-width="2.8"/>
    <circle cx="256" cy="290" r="98" stroke-width="1.6"/>
    <path d="M110 290h292M256 144v292" stroke-width="1.2"/>
  </g>
  <text x="256" y="606" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="36" font-weight="700" fill="rgba(255,245,214,0.95)">${title}</text>
  <text x="256" y="654" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="22" font-weight="600" fill="rgba(255,231,186,0.9)">Flower Tarot</text>
</svg>`;

  const dataUrl = svgToDataUrl(svg);
  tarotSvgCache.set(cacheKey, dataUrl);
  return dataUrl;
}

export function resolveFlowerAssetSlug(flowerId: string): string {
  return FLOWER_SLUG_MAP[flowerId] || "flower";
}

export function getFlowerImageCandidates(flowerId: string): string[] {
  const staticCandidates = FLOWER_IMAGE_MAP[flowerId] || [];
  const fallbackSvg = buildFlowerFallbackSvg(flowerId);

  return [...new Set([...staticCandidates, fallbackSvg, "/fuctionassets/flower.webp"])];
}

export function getFlowerImageAt(flowerId: string, index: number): string {
  const list = getFlowerImageCandidates(flowerId);
  return list[Math.max(0, Math.min(index, list.length - 1))];
}
