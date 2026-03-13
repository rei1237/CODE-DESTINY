import type { SajuElement } from "./types";

export interface FlowerThemeTokens {
  background: string;
  accent: string;
  fontColor: string;
  glow: string;
  fontFamily: string;
}

interface FlowerAssetDefinition {
  slug: string;
  label: string;
  symbol: string;
  element: SajuElement;
  imagePaths: string[];
  theme: FlowerThemeTokens;
}

function buildFlowerPaths(slug: string, flowerId: string): string[] {
  return [
    `/assets/flower/${slug}.webp`,
    `/assets/flower/${slug}.png`,
    `/assets/flower/${flowerId}/${flowerId}.webp`,
    `/assets/flower/${flowerId}/${flowerId}.png`,
    `/fuctionassets/${slug}.webp`,
    `/fuctionassets/${slug}.png`,
  ];
}

const FALLBACK_FLOWER_ASSET: FlowerAssetDefinition = {
  slug: "flower",
  label: "운명꽃",
  symbol: "✿",
  element: "earth",
  imagePaths: ["/fuctionassets/flower.webp"],
  theme: {
    background: "#0a0e14",
    accent: "#c9a84c",
    fontColor: "#fff9e0",
    glow: "rgba(201, 168, 76, 0.5)",
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
  },
};

export const flowerAssets: Record<string, FlowerAssetDefinition> = {
  peony: {
    slug: "flower-peony",
    label: "모란",
    symbol: "✾",
    element: "earth",
    imagePaths: buildFlowerPaths("flower-peony", "peony"),
    theme: {
      background: "#1a1320",
      accent: "#f7b2d9",
      fontColor: "#fff4fb",
      glow: "rgba(247, 178, 217, 0.52)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  rose: {
    slug: "flower-rose",
    label: "장미",
    symbol: "❀",
    element: "fire",
    imagePaths: buildFlowerPaths("flower-rose", "rose"),
    theme: {
      background: "#1c1016",
      accent: "#ff6f91",
      fontColor: "#ffeef3",
      glow: "rgba(255, 111, 145, 0.48)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  lotus: {
    slug: "flower-lotus",
    label: "연꽃",
    symbol: "🪷",
    element: "water",
    imagePaths: buildFlowerPaths("flower-lotus", "lotus"),
    theme: {
      background: "#101a24",
      accent: "#9cd6f7",
      fontColor: "#eef8ff",
      glow: "rgba(156, 214, 247, 0.48)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  camellia: {
    slug: "flower-camellia",
    label: "동백",
    symbol: "✿",
    element: "fire",
    imagePaths: buildFlowerPaths("flower-camellia", "camellia"),
    theme: {
      background: "#211117",
      accent: "#ff7f9f",
      fontColor: "#fff1f4",
      glow: "rgba(255, 127, 159, 0.5)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  chrysanthemum: {
    slug: "flower-chrysanthemum",
    label: "국화",
    symbol: "✼",
    element: "earth",
    imagePaths: buildFlowerPaths("flower-chrysanthemum", "chrysanthemum"),
    theme: {
      background: "#1f1810",
      accent: "#ffd166",
      fontColor: "#fff8e9",
      glow: "rgba(255, 209, 102, 0.5)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  orchid: {
    slug: "flower-orchid",
    label: "난초",
    symbol: "✤",
    element: "wood",
    imagePaths: buildFlowerPaths("flower-orchid", "orchid"),
    theme: {
      background: "#171321",
      accent: "#c7a6ff",
      fontColor: "#f7f0ff",
      glow: "rgba(199, 166, 255, 0.5)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  lily: {
    slug: "flower-lily",
    label: "백합",
    symbol: "✧",
    element: "metal",
    imagePaths: buildFlowerPaths("flower-lily", "lily"),
    theme: {
      background: "#151821",
      accent: "#f2f2f2",
      fontColor: "#ffffff",
      glow: "rgba(242, 242, 242, 0.46)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  edelweiss: {
    slug: "flower-edelweiss",
    label: "에델바이스",
    symbol: "❉",
    element: "metal",
    imagePaths: buildFlowerPaths("flower-edelweiss", "edelweiss"),
    theme: {
      background: "#131926",
      accent: "#d9e2f2",
      fontColor: "#f7fbff",
      glow: "rgba(217, 226, 242, 0.46)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  magnolia: {
    slug: "flower-magnolia",
    label: "목련",
    symbol: "✽",
    element: "earth",
    imagePaths: buildFlowerPaths("flower-magnolia", "magnolia"),
    theme: {
      background: "#201713",
      accent: "#ffd8c2",
      fontColor: "#fff5ef",
      glow: "rgba(255, 216, 194, 0.48)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  sunflower: {
    slug: "flower-sunflower",
    label: "해바라기",
    symbol: "✺",
    element: "fire",
    imagePaths: buildFlowerPaths("flower-sunflower", "sunflower"),
    theme: {
      background: "#20170d",
      accent: "#ffca28",
      fontColor: "#fff6d5",
      glow: "rgba(255, 202, 40, 0.52)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  hydrangea: {
    slug: "flower-hydrangea",
    label: "수국",
    symbol: "❋",
    element: "water",
    imagePaths: buildFlowerPaths("flower-hydrangea", "hydrangea"),
    theme: {
      background: "#101b27",
      accent: "#a2d2ff",
      fontColor: "#eef7ff",
      glow: "rgba(162, 210, 255, 0.5)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  lavender: {
    slug: "flower-lavender",
    label: "라벤더",
    symbol: "✢",
    element: "water",
    imagePaths: buildFlowerPaths("flower-lavender", "lavender"),
    theme: {
      background: "#151627",
      accent: "#b8a7ff",
      fontColor: "#f3f0ff",
      glow: "rgba(184, 167, 255, 0.5)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  plum: {
    slug: "flower-plum",
    label: "매화",
    symbol: "✿",
    element: "wood",
    imagePaths: buildFlowerPaths("flower-plum", "plum"),
    theme: {
      background: "#1c1320",
      accent: "#ffc8dd",
      fontColor: "#fff1f7",
      glow: "rgba(255, 200, 221, 0.5)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
  tulip: {
    slug: "flower-tulip",
    label: "튤립",
    symbol: "❁",
    element: "fire",
    imagePaths: buildFlowerPaths("flower-tulip", "tulip"),
    theme: {
      background: "#211114",
      accent: "#ff7b7b",
      fontColor: "#ffeff0",
      glow: "rgba(255, 123, 123, 0.5)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  daisy: {
    slug: "flower-daisy",
    label: "데이지",
    symbol: "✾",
    element: "metal",
    imagePaths: buildFlowerPaths("flower-daisy", "daisy"),
    theme: {
      background: "#1b1a12",
      accent: "#ffe66d",
      fontColor: "#fff9dd",
      glow: "rgba(255, 230, 109, 0.5)",
      fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
    },
  },
  narcissus: {
    slug: "flower-narcissus",
    label: "수선화",
    symbol: "✺",
    element: "water",
    imagePaths: buildFlowerPaths("flower-narcissus", "narcissus"),
    theme: {
      background: "#1b180f",
      accent: "#ffd43b",
      fontColor: "#fff9d8",
      glow: "rgba(255, 212, 59, 0.5)",
      fontFamily: '"MaruBuri", "Noto Serif KR", serif',
    },
  },
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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFlowerFallbackSvg(flowerId: string): string {
  const asset = flowerAssets[flowerId] ?? FALLBACK_FLOWER_ASSET;
  const cacheKey = `${flowerId}:${asset.theme.accent}:${asset.symbol}`;

  const cacheHit = flowerSvgCache.get(cacheKey);
  if (cacheHit) return cacheHit;

  const label = escapeXml(asset.label || "운명꽃");
  const symbol = escapeXml(asset.symbol || "✿");
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
  <rect width="720" height="720" rx="52" fill="${asset.theme.background}"/>
  <rect width="720" height="720" rx="52" fill="url(#bg)" opacity="0.72"/>
  <g transform="translate(360 320)">
    <g fill="url(#petal)">
      <ellipse rx="82" ry="176" transform="rotate(0)"/>
      <ellipse rx="82" ry="176" transform="rotate(30)"/>
      <ellipse rx="82" ry="176" transform="rotate(60)"/>
      <ellipse rx="82" ry="176" transform="rotate(90)"/>
      <ellipse rx="82" ry="176" transform="rotate(120)"/>
      <ellipse rx="82" ry="176" transform="rotate(150)"/>
    </g>
    <circle r="58" fill="${asset.theme.accent}" opacity="0.86"/>
    <text y="16" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="64" font-weight="700" fill="rgba(12,16,26,0.82)">${symbol}</text>
  </g>
  <text x="360" y="625" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="56" font-weight="700" fill="${asset.theme.fontColor}">${label}</text>
</svg>`;

  const dataUrl = svgToDataUrl(svg);
  flowerSvgCache.set(cacheKey, dataUrl);
  return dataUrl;
}

export function getFlowerThemeTokens(flowerId: string): FlowerThemeTokens {
  return (flowerAssets[flowerId] ?? FALLBACK_FLOWER_ASSET).theme;
}

export function getFlowerElementByAsset(flowerId: string): SajuElement {
  return (flowerAssets[flowerId] ?? FALLBACK_FLOWER_ASSET).element;
}

export function getTarotCardImage(cardId: string, cardName: string): string {
  const cacheKey = `${cardId}:${cardName}`;
  const cacheHit = tarotSvgCache.get(cacheKey);
  if (cacheHit) return cacheHit;

  const hueA = hashHue(cardId, 20);
  const hueB = hashHue(cardId, 155);
  const hueC = hashHue(cardId, 290);
  const title = escapeXml(String(cardName || "Card"));

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
  return (flowerAssets[flowerId] ?? FALLBACK_FLOWER_ASSET).slug;
}

export function getFlowerImageCandidates(flowerId: string): string[] {
  const staticCandidates = (flowerAssets[flowerId] ?? FALLBACK_FLOWER_ASSET).imagePaths;
  const fallbackSvg = buildFlowerFallbackSvg(flowerId);

  return [...new Set([...staticCandidates, fallbackSvg, "/fuctionassets/flower.webp"])];
}

export function getFlowerImageAt(flowerId: string, index: number): string {
  const list = getFlowerImageCandidates(flowerId);
  return list[Math.max(0, Math.min(index, list.length - 1))];
}
