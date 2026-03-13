import {
  AstrologySunSignKey,
  DestinyExtractedSignals,
  DestinyProfile,
  DivinationInput,
  DivinationResult,
  ElementWeightMap,
  FinalDestinyFlower,
  FlowerDefinition,
  LongFormReport,
  SajuElement,
  TarotFinaleCard,
} from "./types";
import flowerDb from "./flower-db.json";

const ELEMENT_ORDER: SajuElement[] = ["wood", "fire", "earth", "metal", "water"];

const ELEMENT_LABEL: Record<SajuElement, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const ELEMENT_NARRATIVE: Record<SajuElement, string> = {
  wood: "성장·확장·기획력",
  fire: "표현력·열정·추진력",
  earth: "안정감·조율·현실화",
  metal: "판단력·정리력·결단력",
  water: "직관·분석·회복력",
};

const ELEMENT_COLOR_HEX: Record<SajuElement, string> = {
  wood: "#46a35f",
  fire: "#e46b5b",
  earth: "#c68a44",
  metal: "#8892ad",
  water: "#4f88d8",
};

const ELEMENT_VISUAL_META: Record<
  SajuElement,
  { icon: string; title: string; effect: string }
> = {
  wood: {
    icon: "🌿",
    title: "생장의 나선",
    effect: "확장성과 기획력이 빠르게 열리는 흐름",
  },
  fire: {
    icon: "🔥",
    title: "점화의 심장",
    effect: "표현력과 추진력이 강하게 가속되는 흐름",
  },
  earth: {
    icon: "🪨",
    title: "균형의 토대",
    effect: "안정·조율·지속성이 단단하게 유지되는 흐름",
  },
  metal: {
    icon: "⚔️",
    title: "정련의 칼날",
    effect: "판단력과 결단의 정확도가 높아지는 흐름",
  },
  water: {
    icon: "🌊",
    title: "회복의 파동",
    effect: "직관·통찰·회복 탄력이 깊게 살아나는 흐름",
  },
};

const ELEMENT_GENERATES: Record<SajuElement, SajuElement> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

const STEM_ELEMENT_MAP: Record<(typeof HEAVENLY_STEMS)[number], SajuElement> = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

const BRANCH_ELEMENT_MAP: Record<(typeof EARTHLY_BRANCHES)[number], SajuElement> = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

type FlowerDbEntry = FlowerDefinition & {
  primaryElement: SajuElement;
};

const FALLBACK_FLOWER: FlowerDefinition = {
  id: "peony",
  name: "Peony",
  koreanAlias: "모란",
  aura: "풍요와 품격",
  palette: ["#ffd6e5", "#f7b2d9"],
  story: "크게 피어나는 꽃잎처럼, 당신의 잠재력이 주변을 환하게 비춥니다.",
};

const FLOWER_DB: FlowerDbEntry[] = (flowerDb.flowers as FlowerDbEntry[]).map((entry) => {
  const [primary, accent] = Array.isArray(entry.palette) ? entry.palette : FALLBACK_FLOWER.palette;
  return {
    id: entry.id || FALLBACK_FLOWER.id,
    name: entry.name || FALLBACK_FLOWER.name,
    koreanAlias: entry.koreanAlias || FALLBACK_FLOWER.koreanAlias,
    aura: entry.aura || FALLBACK_FLOWER.aura,
    palette: [primary || FALLBACK_FLOWER.palette[0], accent || FALLBACK_FLOWER.palette[1]],
    story: entry.story || FALLBACK_FLOWER.story,
    primaryElement: ELEMENT_ORDER.includes(entry.primaryElement) ? entry.primaryElement : "earth",
  };
});

const FLOWERS: Record<string, FlowerDefinition> = FLOWER_DB.reduce<Record<string, FlowerDefinition>>((acc, entry) => {
  acc[entry.id] = {
    id: entry.id,
    name: entry.name,
    koreanAlias: entry.koreanAlias,
    aura: entry.aura,
    palette: [entry.palette[0], entry.palette[1]],
    story: entry.story,
  };
  return acc;
}, {});

const FLOWER_PRIMARY_ELEMENT: Record<string, SajuElement> = FLOWER_DB.reduce<Record<string, SajuElement>>((acc, entry) => {
  acc[entry.id] = entry.primaryElement;
  return acc;
}, {});

const RESOLVED_FALLBACK_FLOWER = FLOWERS.peony || FLOWERS[Object.keys(FLOWERS)[0]] || FALLBACK_FLOWER;

export const ZIWEI_STAR_OPTIONS = [
  "자미(紫微)",
  "천기(天機)",
  "태양(太陽)",
  "무곡(武曲)",
  "천동(天同)",
  "염정(廉貞)",
  "천부(天府)",
  "태음(太陰)",
  "탐랑(貪狼)",
  "거문(巨門)",
  "천상(天相)",
  "천량(天梁)",
  "칠살(七殺)",
  "파군(破軍)",
] as const;

const ZIWEI_PALACE_OPTIONS = [
  "명궁",
  "형제궁",
  "부부궁",
  "자녀궁",
  "재백궁",
  "질액궁",
  "천이궁",
  "교우궁",
  "관록궁",
  "전택궁",
  "복덕궁",
  "부모궁",
] as const;

export const SUKUYO_OPTIONS = [
  "각숙", "항숙", "저숙", "방숙", "심숙", "미숙", "기숙",
  "두숙", "우숙", "녀숙", "허숙", "위숙", "실숙", "벽숙",
  "규숙", "루숙", "위토숙", "묘숙", "필숙", "자숙", "삼숙",
  "정숙", "귀숙", "류숙", "성숙", "장숙", "익숙", "진숙",
] as const;

const SAJU_FLOWER_BY_ELEMENT: Record<SajuElement, string> = {
  wood: "orchid",
  fire: "rose",
  earth: "chrysanthemum",
  metal: "edelweiss",
  water: "lotus",
};

const ZIWEI_FLOWER_BY_STAR: Record<string, string> = {
  "자미(紫微)": "peony",
  "천기(天機)": "orchid",
  "태양(太陽)": "sunflower",
  "무곡(武曲)": "magnolia",
  "천동(天同)": "hydrangea",
  "염정(廉貞)": "camellia",
  "천부(天府)": "chrysanthemum",
  "탐랑(貪狼)": "rose",
  "거문(巨門)": "lavender",
  "태음(太陰)": "lotus",
  "천상(天相)": "lily",
  "천량(天梁)": "narcissus",
  "칠살(七殺)": "plum",
  "파군(破軍)": "tulip",
};

const ASTRO_FLOWER_BY_SIGN: Record<string, string> = {
  Aries: "tulip",
  Taurus: "peony",
  Gemini: "daisy",
  Cancer: "lotus",
  Leo: "sunflower",
  Virgo: "lily",
  Libra: "rose",
  Scorpio: "camellia",
  Sagittarius: "magnolia",
  Capricorn: "chrysanthemum",
  Aquarius: "lavender",
  Pisces: "hydrangea",
};

const SUKUYO_FLOWER_BY_MANSION: Record<string, string> = {
  각숙: "plum",
  항숙: "orchid",
  저숙: "lily",
  방숙: "rose",
  심숙: "camellia",
  미숙: "chrysanthemum",
  기숙: "sunflower",
  두숙: "lavender",
  우숙: "magnolia",
  녀숙: "daisy",
  허숙: "lotus",
  위숙: "hydrangea",
  실숙: "peony",
  벽숙: "lily",
  규숙: "tulip",
  루숙: "orchid",
  위토숙: "narcissus",
  묘숙: "sunflower",
  필숙: "chrysanthemum",
  자숙: "camellia",
  삼숙: "magnolia",
  정숙: "lotus",
  귀숙: "plum",
  류숙: "rose",
  성숙: "hydrangea",
  장숙: "peony",
  익숙: "lavender",
  진숙: "narcissus",
};

const POSITIVE_FLOWERS_BY_DAILY_ELEMENT: Record<SajuElement, string[]> = {
  wood: ["orchid", "plum", "magnolia", "peony"],
  fire: ["sunflower", "rose", "tulip", "camellia"],
  earth: ["chrysanthemum", "peony", "lily", "magnolia"],
  metal: ["lily", "edelweiss", "daisy", "narcissus"],
  water: ["lotus", "hydrangea", "lavender", "narcissus"],
};

const GLOBAL_POSITIVE_FLOWERS = new Set<string>([
  "peony",
  "sunflower",
  "lotus",
  "orchid",
  "lily",
  "hydrangea",
  "narcissus",
]);

const PALACE_CARD_BONUS: Record<string, string[]> = {
  명궁: ["sun", "star", "judgement"],
  부부궁: ["lovers", "empress", "temperance"],
  재백궁: ["wheel", "magician", "emperor"],
  관록궁: ["chariot", "justice", "world"],
  복덕궁: ["hermit", "moon", "high-priestess"],
};

export const TAROT_FINALE_DECK: TarotFinaleCard[] = [
  {
    id: "fool",
    arcanaNo: 0,
    name: "The Fool",
    subtitle: "새 출발의 부름",
    reveal: "익숙한 틀을 벗어날수록 운의 새 루트가 열립니다.",
    boostFlowerIds: ["tulip", "daisy", "magnolia"],
    effectText: "정체 구간을 끊고 기회를 먼저 잡는 힘이 강해집니다.",
    affinityElements: ["wood", "fire"],
    baseWeight: 1.0,
  },
  {
    id: "magician",
    arcanaNo: 1,
    name: "The Magician",
    subtitle: "현실화의 주문",
    reveal: "흩어진 재능을 한 지점으로 모으면 성과가 급격히 올라갑니다.",
    boostFlowerIds: ["orchid", "rose", "sunflower"],
    effectText: "실행력과 설득력이 동시에 상승합니다.",
    affinityElements: ["wood", "fire", "metal"],
    baseWeight: 1.12,
  },
  {
    id: "high-priestess",
    arcanaNo: 2,
    name: "The High Priestess",
    subtitle: "직감의 서고",
    reveal: "보이지 않던 맥락이 조용히 연결되며 해답이 떠오릅니다.",
    boostFlowerIds: ["lotus", "lavender", "hydrangea"],
    effectText: "감정 해석력과 내적 집중도가 깊어집니다.",
    affinityElements: ["water", "metal"],
    baseWeight: 1.08,
  },
  {
    id: "empress",
    arcanaNo: 3,
    name: "The Empress",
    subtitle: "풍요의 개화",
    reveal: "돌봄과 창조의 에너지가 확장되며 관계의 온도가 올라갑니다.",
    boostFlowerIds: ["peony", "rose", "camellia"],
    effectText: "관계운과 창조성이 활짝 열립니다.",
    affinityElements: ["earth", "fire", "water"],
    baseWeight: 1.16,
  },
  {
    id: "emperor",
    arcanaNo: 4,
    name: "The Emperor",
    subtitle: "구조와 통제",
    reveal: "기준과 원칙을 재정비하면 손실이 줄고 속도가 붙습니다.",
    boostFlowerIds: ["chrysanthemum", "lily", "magnolia"],
    effectText: "리더십과 시스템 운영력이 강화됩니다.",
    affinityElements: ["earth", "metal"],
    baseWeight: 1.1,
  },
  {
    id: "hierophant",
    arcanaNo: 5,
    name: "The Hierophant",
    subtitle: "전통의 문",
    reveal: "검증된 방식과 스승의 조언이 지름길을 만듭니다.",
    boostFlowerIds: ["lily", "chrysanthemum", "plum"],
    effectText: "학습 속도와 신뢰 자산이 올라갑니다.",
    affinityElements: ["earth", "metal", "water"],
    baseWeight: 0.95,
  },
  {
    id: "lovers",
    arcanaNo: 6,
    name: "The Lovers",
    subtitle: "선택과 공명",
    reveal: "관계와 가치의 우선순위를 맞추면 에너지가 낭비되지 않습니다.",
    boostFlowerIds: ["rose", "hydrangea", "daisy"],
    effectText: "신뢰·협업·애정의 흐름이 부드럽게 연결됩니다.",
    affinityElements: ["fire", "water", "wood"],
    baseWeight: 1.0,
  },
  {
    id: "chariot",
    arcanaNo: 7,
    name: "The Chariot",
    subtitle: "전진의 축",
    reveal: "의지와 방향이 일치하면 경쟁 상황에서 확실한 우위를 만듭니다.",
    boostFlowerIds: ["sunflower", "tulip", "orchid"],
    effectText: "속도전·승부처 대응력이 크게 향상됩니다.",
    affinityElements: ["fire", "wood", "metal"],
    baseWeight: 1.14,
  },
  {
    id: "strength",
    arcanaNo: 8,
    name: "Strength",
    subtitle: "온화한 통솔",
    reveal: "강한 힘보다 안정된 호흡이 장기전에서 우세를 만듭니다.",
    boostFlowerIds: ["camellia", "chrysanthemum", "lotus"],
    effectText: "감정 제어와 회복 탄력성이 강화됩니다.",
    affinityElements: ["fire", "earth", "water"],
    baseWeight: 1.06,
  },
  {
    id: "hermit",
    arcanaNo: 9,
    name: "The Hermit",
    subtitle: "심층 탐구",
    reveal: "혼자만의 점검 시간이 오히려 외부 성과를 끌어올립니다.",
    boostFlowerIds: ["lavender", "plum", "lotus"],
    effectText: "판단 정밀도와 통찰의 깊이가 올라갑니다.",
    affinityElements: ["water", "earth", "metal"],
    baseWeight: 0.97,
  },
  {
    id: "wheel",
    arcanaNo: 10,
    name: "Wheel of Fortune",
    subtitle: "반전의 바람",
    reveal: "타이밍을 맞추면 정체된 구간이 한 번에 회전합니다.",
    boostFlowerIds: ["magnolia", "plum", "chrysanthemum"],
    effectText: "변화 대응력과 기회 포착 감각이 극대화됩니다.",
    affinityElements: ["wood", "fire", "earth", "metal", "water"],
    baseWeight: 1.2,
  },
  {
    id: "justice",
    arcanaNo: 11,
    name: "Justice",
    subtitle: "균형의 심판",
    reveal: "근거 중심 판단이 관계와 계약에서 손해를 줄여줍니다.",
    boostFlowerIds: ["lily", "daisy", "orchid"],
    effectText: "협상력과 의사결정의 정합성이 상승합니다.",
    affinityElements: ["metal", "earth"],
    baseWeight: 1.04,
  },
  {
    id: "hanged-man",
    arcanaNo: 12,
    name: "The Hanged Man",
    subtitle: "관점 전환",
    reveal: "속도를 늦추고 재정렬하면 숨은 비용을 회수할 수 있습니다.",
    boostFlowerIds: ["hydrangea", "lotus", "daisy"],
    effectText: "고착된 문제를 다른 각도에서 풀어내는 힘이 생깁니다.",
    affinityElements: ["water", "wood"],
    baseWeight: 0.9,
  },
  {
    id: "death",
    arcanaNo: 13,
    name: "Death",
    subtitle: "종결과 재생",
    reveal: "필요 없는 루틴을 과감히 끝내야 새 운이 들어옵니다.",
    boostFlowerIds: ["plum", "camellia", "narcissus"],
    effectText: "리셋 이후 회복 속도와 집중력이 빨라집니다.",
    affinityElements: ["water", "metal", "fire"],
    baseWeight: 0.94,
  },
  {
    id: "temperance",
    arcanaNo: 14,
    name: "Temperance",
    subtitle: "조율의 기적",
    reveal: "서로 다른 리듬을 섞는 과정에서 지속 가능한 해답이 탄생합니다.",
    boostFlowerIds: ["orchid", "lily", "daisy"],
    effectText: "의사결정이 유연하고 선명해집니다.",
    affinityElements: ["water", "earth", "fire"],
    baseWeight: 1.08,
  },
  {
    id: "devil",
    arcanaNo: 15,
    name: "The Devil",
    subtitle: "욕망의 계약",
    reveal: "집착의 방향을 바꾸면 강한 집중력이 성과로 전환됩니다.",
    boostFlowerIds: ["rose", "camellia", "chrysanthemum"],
    effectText: "몰입 강도와 성취 집념이 상승합니다.",
    affinityElements: ["fire", "earth", "metal"],
    baseWeight: 0.92,
  },
  {
    id: "tower",
    arcanaNo: 16,
    name: "The Tower",
    subtitle: "붕괴 후 재구축",
    reveal: "약한 구조가 먼저 무너지고, 본질만 남아 속도가 붙습니다.",
    boostFlowerIds: ["tulip", "sunflower", "magnolia"],
    effectText: "위기 대응력과 손절 판단이 빨라집니다.",
    affinityElements: ["fire", "metal"],
    baseWeight: 0.88,
  },
  {
    id: "star",
    arcanaNo: 17,
    name: "The Star",
    subtitle: "회복의 서약",
    reveal: "불안을 씻고 장기 목표를 다시 밝히는 치유의 신호입니다.",
    boostFlowerIds: ["lotus", "lavender", "hydrangea"],
    effectText: "감정 안정과 직관력이 강화됩니다.",
    affinityElements: ["water", "wood"],
    baseWeight: 1.18,
  },
  {
    id: "moon",
    arcanaNo: 18,
    name: "The Moon",
    subtitle: "심연의 직감",
    reveal: "불명확한 감정이 떠오르며 진짜 욕망과 마주하게 됩니다.",
    boostFlowerIds: ["lotus", "camellia", "lavender"],
    effectText: "무의식 신호 해석력이 짙어집니다.",
    affinityElements: ["water", "earth"],
    baseWeight: 1.07,
  },
  {
    id: "sun",
    arcanaNo: 19,
    name: "The Sun",
    subtitle: "광휘의 축복",
    reveal: "자기확신이 올라가며 주변과의 협업도 동시 상승합니다.",
    boostFlowerIds: ["sunflower", "narcissus", "tulip"],
    effectText: "자신감과 표현력이 크게 상승합니다.",
    affinityElements: ["fire", "wood", "earth"],
    baseWeight: 1.24,
  },
  {
    id: "judgement",
    arcanaNo: 20,
    name: "Judgement",
    subtitle: "각성의 호출",
    reveal: "과거 데이터를 재해석하면 다음 선택이 선명해집니다.",
    boostFlowerIds: ["narcissus", "plum", "orchid"],
    effectText: "복기·학습·재도전에서 강한 운이 붙습니다.",
    affinityElements: ["metal", "water", "fire"],
    baseWeight: 1.05,
  },
  {
    id: "world",
    arcanaNo: 21,
    name: "The World",
    subtitle: "완성의 환희",
    reveal: "분절된 흐름이 하나로 통합되며 마무리 운이 살아납니다.",
    boostFlowerIds: ["peony", "magnolia", "sunflower"],
    effectText: "성과 정리와 다음 단계 연결이 자연스럽게 이루어집니다.",
    affinityElements: ["wood", "fire", "earth", "metal", "water"],
    baseWeight: 1.22,
  },
];

const ZODIAC_RANGES: Array<{ sign: AstrologySunSignKey; start: [number, number]; end: [number, number] }> = [
  { sign: "Capricorn", start: [1, 1], end: [1, 19] },
  { sign: "Aquarius", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", start: [2, 19], end: [3, 20] },
  { sign: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", start: [5, 21], end: [6, 21] },
  { sign: "Cancer", start: [6, 22], end: [7, 22] },
  { sign: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", start: [8, 23], end: [9, 23] },
  { sign: "Libra", start: [9, 24], end: [10, 22] },
  { sign: "Scorpio", start: [10, 23], end: [11, 22] },
  { sign: "Sagittarius", start: [11, 23], end: [12, 21] },
  { sign: "Capricorn", start: [12, 22], end: [12, 31] },
];

const ZODIAC_GUARDIAN: Record<AstrologySunSignKey, string> = {
  Aries: "화성",
  Taurus: "금성",
  Gemini: "수성",
  Cancer: "달",
  Leo: "태양",
  Virgo: "수성",
  Libra: "금성",
  Scorpio: "명왕성",
  Sagittarius: "목성",
  Capricorn: "토성",
  Aquarius: "천왕성",
  Pisces: "해왕성",
};

const ZODIAC_KOREAN_LABEL: Record<AstrologySunSignKey, string> = {
  Aries: "양자리",
  Taurus: "황소자리",
  Gemini: "쌍둥이자리",
  Cancer: "게자리",
  Leo: "사자자리",
  Virgo: "처녀자리",
  Libra: "천칭자리",
  Scorpio: "전갈자리",
  Sagittarius: "사수자리",
  Capricorn: "염소자리",
  Aquarius: "물병자리",
  Pisces: "물고기자리",
};

const ZODIAC_SYMBOL: Record<AstrologySunSignKey, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

const ZODIAC_KEYS = Object.keys(ZODIAC_GUARDIAN) as AstrologySunSignKey[];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function getDayIndex(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function hashFromSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sortElementsByWeight(weights: ElementWeightMap): SajuElement[] {
  return [...ELEMENT_ORDER].sort((a, b) => (weights[b] || 0) - (weights[a] || 0));
}

function normalizeWeights(rawWeights: ElementWeightMap): ElementWeightMap {
  const sum = ELEMENT_ORDER.reduce((acc, key) => acc + rawWeights[key], 0);
  if (!sum) {
    return { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
  }

  const normalized: ElementWeightMap = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  ELEMENT_ORDER.forEach((element) => {
    normalized[element] = Number(((rawWeights[element] / sum) * 100).toFixed(1));
  });

  const currentSum = ELEMENT_ORDER.reduce((acc, key) => acc + normalized[key], 0);
  const diff = Number((100 - currentSum).toFixed(1));
  if (Math.abs(diff) > 0.001) {
    const dominant = sortElementsByWeight(normalized)[0] || "earth";
    normalized[dominant] = Number((normalized[dominant] + diff).toFixed(1));
  }

  return normalized;
}

function addWeight(target: ElementWeightMap, element: SajuElement, amount: number) {
  target[element] = (target[element] || 0) + amount;
}

function getSeasonBonus(month: number): Partial<ElementWeightMap> {
  if ([2, 3, 4].includes(month)) return { wood: 1.2, fire: 0.5 };
  if ([5, 6, 7].includes(month)) return { fire: 1.1, earth: 0.6 };
  if ([8, 9, 10].includes(month)) return { metal: 1.2, earth: 0.5 };
  return { water: 1.1, wood: 0.4 };
}

function resolveStemBranchByDayIndex(dayIndex: number): {
  stem: (typeof HEAVENLY_STEMS)[number];
  branch: (typeof EARTHLY_BRANCHES)[number];
} {
  const stemIndex = ((dayIndex + 50) % 10 + 10) % 10;
  const branchIndex = ((dayIndex + 38) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

function resolveZodiacSign(month: number, day: number): AstrologySunSignKey {
  const found = ZODIAC_RANGES.find((range) => {
    const [sm, sd] = range.start;
    const [em, ed] = range.end;
    const startKey = sm * 100 + sd;
    const endKey = em * 100 + ed;
    const currentKey = month * 100 + day;
    return currentKey >= startKey && currentKey <= endKey;
  });
  return found?.sign || "Leo";
}

function formatZodiacLabel(sign: AstrologySunSignKey): string {
  return `${ZODIAC_SYMBOL[sign]} ${ZODIAC_KOREAN_LABEL[sign]} · ${ZODIAC_GUARDIAN[sign]}`;
}

function resolveSukuyoMansion(year: number, month: number, day: number): string {
  const index = ((getDayIndex(year, month, day) % SUKUYO_OPTIONS.length) + SUKUYO_OPTIONS.length) % SUKUYO_OPTIONS.length;
  return SUKUYO_OPTIONS[index];
}

function resolveZiweiSignal(profile: DestinyProfile): { star: string; palace: string } {
  const birth = profile.birth;
  const hourValue = typeof birth.hour === "number" ? birth.hour : 12;
  const hourBranchIndex = Math.floor((((hourValue % 24) + 1) % 24) / 2);
  const genderBias = /^m$/i.test(profile.gender || "") ? 3 : 0;
  const starIndex = (birth.year + birth.month + birth.day + hourBranchIndex + genderBias) % ZIWEI_STAR_OPTIONS.length;
  const palaceIndex = (birth.month * 2 + birth.day + hourBranchIndex) % ZIWEI_PALACE_OPTIONS.length;

  return {
    star: ZIWEI_STAR_OPTIONS[starIndex],
    palace: ZIWEI_PALACE_OPTIONS[palaceIndex],
  };
}

function buildElementWeights(profile: DestinyProfile): {
  elementWeights: ElementWeightMap;
  dominantElement: SajuElement;
  supportElement: SajuElement;
  lackingElement: SajuElement;
  dayStem: string;
  dayElement: SajuElement;
  dailyElement: SajuElement;
  dailyStemBranch: string;
  isBirthTimeKnown: boolean;
} {
  const birth = profile.birth;
  const weights: ElementWeightMap = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };

  const yearStemIndex = ((birth.year - 4) % 10 + 10) % 10;
  const yearBranchIndex = ((birth.year - 4) % 12 + 12) % 12;
  const monthBranchIndex = ((birth.month + 1) % 12 + 12) % 12;

  const dayIndex = getDayIndex(birth.year, birth.month, birth.day);
  const dayStemIndex = ((dayIndex + 50) % 10 + 10) % 10;
  const dayBranchIndex = ((dayIndex + 38) % 12 + 12) % 12;

  const isBirthTimeKnown = typeof birth.hour === "number" && typeof birth.minute === "number";
  const hourValue = typeof birth.hour === "number" ? birth.hour : 12;
  const hourBranchIndex = Math.floor((((hourValue % 24) + 1) % 24) / 2);
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;

  addWeight(weights, STEM_ELEMENT_MAP[HEAVENLY_STEMS[yearStemIndex]], 2.2);
  addWeight(weights, BRANCH_ELEMENT_MAP[EARTHLY_BRANCHES[yearBranchIndex]], 1.7);
  addWeight(weights, BRANCH_ELEMENT_MAP[EARTHLY_BRANCHES[monthBranchIndex]], 2.1);
  addWeight(weights, STEM_ELEMENT_MAP[HEAVENLY_STEMS[dayStemIndex]], 2.5);
  addWeight(weights, BRANCH_ELEMENT_MAP[EARTHLY_BRANCHES[dayBranchIndex]], 1.3);

  if (isBirthTimeKnown) {
    addWeight(weights, STEM_ELEMENT_MAP[HEAVENLY_STEMS[hourStemIndex]], 0.9);
    addWeight(weights, BRANCH_ELEMENT_MAP[EARTHLY_BRANCHES[hourBranchIndex]], 1.0);
  } else {
    ELEMENT_ORDER.forEach((element) => addWeight(weights, element, 0.35));
  }

  const seasonBonus = getSeasonBonus(birth.month);
  ELEMENT_ORDER.forEach((element) => {
    if (seasonBonus[element]) addWeight(weights, element, seasonBonus[element] || 0);
  });

  const elementWeights = normalizeWeights(weights);
  const ranked = sortElementsByWeight(elementWeights);

  const dominantElement = ranked[0] || "earth";
  const supportElement = ranked[1] || ELEMENT_GENERATES[dominantElement];
  const lackingElement = ranked[ranked.length - 1] || "water";

  const dayStem = HEAVENLY_STEMS[dayStemIndex];
  const dayElement = STEM_ELEMENT_MAP[dayStem];

  const today = new Date();
  const todayIndex = getDayIndex(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate());
  const todayStemBranch = resolveStemBranchByDayIndex(todayIndex);
  const dailyElement = STEM_ELEMENT_MAP[todayStemBranch.stem];

  return {
    elementWeights,
    dominantElement,
    supportElement,
    lackingElement,
    dayStem,
    dayElement,
    dailyElement,
    dailyStemBranch: `${todayStemBranch.stem}${todayStemBranch.branch}`,
    isBirthTimeKnown,
  };
}

function resolveZodiacKey(raw: string): AstrologySunSignKey {
  const normalized = String(raw || "").trim();
  const matched = ZODIAC_KEYS.find((key) => normalized.includes(key) || normalized.includes(ZODIAC_KOREAN_LABEL[key]));
  return matched || "Leo";
}

function makeResult(
  kind: DivinationResult["kind"],
  title: string,
  subtitle: string,
  flowerId: string,
  summary: string,
  details: string,
  basisLine: string,
  score: number,
  element: SajuElement,
): DivinationResult {
  const flower = getFlowerDefinition(flowerId);
  return {
    kind,
    title,
    subtitle,
    flowerId,
    flowerName: `${flower.koreanAlias} (${flower.name})`,
    summary,
    details,
    basisLine,
    score,
    accentHex: flower.palette[1],
    element,
  };
}

function resolveSajuFlowerByCrossSignal(input: DivinationInput): string {
  if (input.dominantElement === "water" && input.supportElement === "wood") {
    return "lotus";
  }

  if (input.dominantElement === "fire" && input.supportElement === "earth") {
    return "sunflower";
  }

  if (input.dominantElement === "metal" && input.supportElement === "earth") {
    return "edelweiss";
  }

  if (input.dominantElement === "wood" && input.supportElement === "water") {
    return "plum";
  }

  return SAJU_FLOWER_BY_ELEMENT[input.dominantElement] || "peony";
}

function computeTarotWeight(card: TarotFinaleCard, input: DivinationInput): number {
  let weight = card.baseWeight;

  const favorableFlowers = new Set<string>([
    ...(POSITIVE_FLOWERS_BY_DAILY_ELEMENT[input.dailyElement] || []),
    resolveSajuFlowerByCrossSignal(input),
    SAJU_FLOWER_BY_ELEMENT[input.supportElement] || "peony",
  ]);

  if (card.affinityElements.includes(input.dominantElement)) weight += 1.45;
  if (card.affinityElements.includes(input.supportElement)) weight += 0.95;
  if (card.affinityElements.includes(input.lackingElement)) weight += 0.75;
  if (card.affinityElements.includes(input.dayElement)) weight += 1.2;
  if (card.affinityElements.includes(input.dailyElement)) weight += 0.8;

  const favorableMatchCount = card.boostFlowerIds.filter((flowerId) => favorableFlowers.has(flowerId)).length;
  if (favorableMatchCount > 0) {
    weight += favorableMatchCount * 0.72;
  }

  const globalPositiveMatchCount = card.boostFlowerIds.filter((flowerId) => GLOBAL_POSITIVE_FLOWERS.has(flowerId)).length;
  if (globalPositiveMatchCount > 0) {
    weight += globalPositiveMatchCount * 0.28;
  }

  const palaceCards = PALACE_CARD_BONUS[input.ziweiPalace] || [];
  if (palaceCards.includes(card.id)) weight += 1.05;

  return Math.max(0.35, Number(weight.toFixed(4)));
}

function buildLongFormReport(
  input: DivinationInput,
  winner: FlowerDefinition,
  results: DivinationResult[],
  pickedTarot: TarotFinaleCard,
): LongFormReport {
  const scoreSummary = results.map((item) => `${item.title} ${item.score}점`).join(" · ");
  const resultSignals = results.map((item) => `${item.subtitle}`).join(" / ");
  const sajuResult = results.find((item) => item.kind === "saju");
  const ziweiResult = results.find((item) => item.kind === "ziwei");
  const sukuyoResult = results.find((item) => item.kind === "sukuyo");
  const astrologyResult = results.find((item) => item.kind === "astrology");

  const birthTimeLine = input.isBirthTimeKnown
    ? "생시 정보가 반영된 차트로 정밀 계산되어 시간대별 기운 변화가 분석에 반영되었습니다."
    : "생시 정보가 없어 12:00 평시 보정 차트로 계산했으며, 시간 오차 가능성은 보수적으로 반영되었습니다.";

  const opening =
    `${input.profileName}님의 리포트는 생년월일시 명리 데이터와 자미두수·숙요·점성술 신호를 교차 검증해 작성한 장문 분석입니다. ` +
    `핵심 흐름은 ${ELEMENT_LABEL[input.dominantElement]}(${input.elementWeights[input.dominantElement]}%) 우세와 ${ELEMENT_LABEL[input.supportElement]} 보조, ${ELEMENT_LABEL[input.lackingElement]} 보완이라는 삼각 구조이며, 최종적으로 ${pickedTarot.name} 카드가 결론의 방향을 고정해 ${winner.koreanAlias} 상징으로 수렴했습니다.`;

  const sections = [
    {
      title: "섹션 1 [운명의 근원]",
      body:
        `${input.birthLabel} 기준으로 계산된 일간은 ${input.dayStem}이며, 기본 운용 축은 ${ELEMENT_LABEL[input.dominantElement]} 중심의 ${ELEMENT_NARRATIVE[input.dominantElement]} 성향으로 읽힙니다. ` +
        `보조 축인 ${ELEMENT_LABEL[input.supportElement]}은 실행의 안정성을 높여 주는 반면, ${ELEMENT_LABEL[input.lackingElement]}은 과부하 시 균형이 무너지기 쉬운 취약점으로 작동합니다. ` +
        `${birthTimeLine} 또한 오늘의 일진 ${input.dailyStemBranch}은 즉흥 결정보다 구조화된 선택을 권하며, 단기 성과보다 중기 누적 효율을 선택할 때 운세 체감이 더 크게 나타나는 패턴입니다. ` +
        `따라서 이번 사이클의 명리 요약은 “강점의 선명한 발현 + 취약 요소의 선제 보정 + 일정 리듬의 일관성 유지”로 정리할 수 있습니다.`,
    },
    {
      title: "섹션 2 [당신을 닮은 꽃]",
      body:
        `이번 분석에서 선정된 꽃은 ${winner.koreanAlias}(${winner.name})이며, 아우라는 “${winner.aura}”로 해석됩니다. ` +
        `${winner.story} 이 상징은 단순 취향 묘사가 아니라, 사용자의 반응 방식·관계 온도·의사결정 리듬을 압축한 심리적 메타포에 가깝습니다. ` +
        `${winner.koreanAlias}이 지닌 이미지는 외부 자극에 즉시 흔들리기보다 스스로 리듬을 만들고 환경을 정돈해 개화하는 흐름입니다. ` +
        `즉, 당신의 기질은 감정의 파고를 부정하기보다 패턴으로 읽고, 필요한 순간에 기준을 세워 에너지를 재배치할 때 가장 아름답게 확장됩니다. ` +
        `이 꽃은 “타고난 성향”을 말하는 동시에, 앞으로 선택해야 할 삶의 운영 방식까지 제안하는 상징으로 기능합니다.`,
    },
    {
      title: "섹션 3 [심층 분석]",
      body:
        `사주 결과(${sajuResult?.title ?? "사주"})에서는 ${sajuResult?.basisLine ?? "일간 오행 비율"}을 근거로 ${sajuResult?.flowerName ?? winner.koreanAlias} 후보가 강하게 형성되었습니다. ` +
        `자미두수 결과(${ziweiResult?.title ?? "자미두수"})는 ${input.ziweiStar}·${input.ziweiPalace} 축에서 나타나는 역할 책임성과 대인 조율 패턴을 통해 ${ziweiResult?.flowerName ?? winner.koreanAlias} 계열의 상징을 보강했습니다. ` +
        `숙요 결과(${sukuyoResult?.title ?? "숙요"})는 ${input.sukuyoMansion} 타이밍에서 드러나는 감정 리듬과 관계 민감도를 반영해 최종 후보군의 우선순위를 미세 조정했습니다. ` +
        `점성술 결과(${astrologyResult?.title ?? "점성술"})는 ${input.sunSignLabel} 신호를 통해 표현 방식과 외부 노출 에너지의 방향성을 확인했습니다. ` +
        `종합하면 “당신의 차트에서 ${ELEMENT_LABEL[input.dominantElement]} 기운이 강하게 작동하고, ${ELEMENT_LABEL[input.supportElement]}이 이를 지지하며, ${ELEMENT_LABEL[input.lackingElement]} 보완이 필요하기 때문에” 현재 운세 지형에서 ${winner.koreanAlias}이 가장 논리적으로 높은 적합도를 보입니다.`,
    },
    {
      title: "섹션 4 [조언]",
      body:
        `개운법(運을 여는 법)의 첫 단계는 에너지 누수를 막는 생활 리듬 고정입니다. 매일 같은 시간대에 시작 루틴(물 한 잔, 5분 호흡, 오늘의 1순위 기록)을 반복해 운의 기저 진동을 안정화하세요. ` +
        `둘째, 환경 제언으로는 작업 공간을 “집중 구역 1개 + 정리 구역 1개”로 단순화하고, 시야에 들어오는 물건 수를 줄여 결정 피로를 낮추는 것이 유리합니다. ` +
        `셋째, ${ELEMENT_LABEL[input.lackingElement]} 보완을 위해 수면·수분·정리 중 하나를 핵심 습관으로 지정해 14일 연속 유지하면 체감 운이 빠르게 회복됩니다. ` +
        `넷째, 인간관계에서는 즉답보다 확인 문장을 먼저 두어 오해를 줄이고, 중요한 제안은 오전 시간대에 전달해 수용 확률을 높이세요. ` +
        `다섯째, 주 1회 20분 복기(잘한 점 3개, 멈출 점 1개, 다음 실험 1개)를 실행하면 ${winner.koreanAlias} 상징의 장점이 일시적 행운이 아닌 재현 가능한 성과 루틴으로 고정됩니다.`,
    },
  ];

  let closing =
    `최종 결론은 ${resultSignals} 신호가 하나의 축으로 모이며 ${winner.koreanAlias} 상징을 강화했다는 점입니다. ` +
    `점수 분포(${scoreSummary})는 이미 성장 가능한 기반이 충분함을 보여 주며, 이제 성패를 가르는 변수는 거대한 변화가 아니라 작은 반복의 정확도입니다.`;

  let fullText = [
    opening,
    ...sections.map((section) => `${section.title}\n${section.body}`),
    closing,
  ].join("\n\n");

  const filler =
    `보강 해설: 이번 주는 빠른 결론보다 근거를 남기는 태도가 운세 안정성에 직접 기여합니다. ` +
    `메모 한 줄, 일정 확인 메시지 한 번, 종료 전 점검 3분이 누적되면 실수 비용이 줄고 관계 신뢰가 함께 상승합니다. ` +
    `같은 루틴을 7일 이상 유지하면 운의 체감은 단발적 상승이 아니라 장기 패턴으로 고정됩니다.`;

  while (fullText.length < 1000) {
    closing = `${closing} ${filler}`;
    fullText = [
      opening,
      ...sections.map((section) => `${section.title}\n${section.body}`),
      closing,
    ].join("\n\n");
  }

  return {
    opening,
    sections,
    closing,
    fullText,
    totalLength: fullText.length,
  };
}

export function getFlowerDefinition(flowerId: string): FlowerDefinition {
  return FLOWERS[flowerId] ?? RESOLVED_FALLBACK_FLOWER;
}

export function deriveDivinationInput(profile: DestinyProfile): DivinationInput {
  const birth = profile.birth;
  const sunSignKey = resolveZodiacSign(birth.month, birth.day);
  const sunSignLabel = `${ZODIAC_SYMBOL[sunSignKey]} ${ZODIAC_KOREAN_LABEL[sunSignKey]}`;
  const zodiacSign = formatZodiacLabel(sunSignKey);
  const sukuyoMansion = resolveSukuyoMansion(birth.year, birth.month, birth.day);
  const ziwei = resolveZiweiSignal(profile);
  const element = buildElementWeights(profile);

  const birthLabel = `${birth.year}년 ${birth.month}월 ${birth.day}일`;
  const locationLabel = profile.location?.label || "출생지 미입력";
  const profileId = profile.id || "profile";
  const profileName = profile.name || "사용자";

  const crossSignals = [
    `${element.dayStem} 일간 기반 ${ELEMENT_LABEL[element.dominantElement]} 우세 · ${ELEMENT_LABEL[element.lackingElement]} 보강 필요`,
    `${ziwei.star}(${ziwei.palace})와 ${sunSignLabel} 상징이 동시 공명`,
    `숙요 ${sukuyoMansion} + 일진 ${element.dailyStemBranch}이 오늘의 카드 가중치에 반영`,
  ];

  if (!element.isBirthTimeKnown) {
    crossSignals.push("생시 정보가 없어 12:00 평시 보정으로 계산되었습니다.");
  }

  const timeSeed = `${birth.hour ?? "x"}:${birth.minute ?? "x"}`;
  const baseSeed = [
    profileId,
    profileName,
    birth.year,
    birth.month,
    birth.day,
    timeSeed,
    ziwei.star,
    zodiacSign,
    sukuyoMansion,
  ].join(":");

  return {
    profileId,
    profileName,
    gender: profile.gender || "F",
    birthLabel,
    locationLabel,
    dayStem: element.dayStem,
    dominantElement: element.dominantElement,
    supportElement: element.supportElement,
    lackingElement: element.lackingElement,
    dayElement: element.dayElement,
    dailyElement: element.dailyElement,
    elementWeights: element.elementWeights,
    ziweiMainStar: ziwei.star,
    ziweiStar: ziwei.star,
    ziweiPalace: ziwei.palace,
    sunSignKey,
    sunSignLabel,
    sunSignSymbol: ZODIAC_SYMBOL[sunSignKey],
    zodiacSign,
    sukuyoMansion,
    dailyStemBranch: element.dailyStemBranch,
    crossSignals,
    baseSeed,
    isBirthTimeKnown: element.isBirthTimeKnown,
  };
}

export function buildDivinationResults(input: DivinationInput): DivinationResult[] {
  const zodiacKey = input.sunSignKey || resolveZodiacKey(input.zodiacSign);
  const sajuFlower = resolveSajuFlowerByCrossSignal(input);
  const ziweiFlower = ZIWEI_FLOWER_BY_STAR[input.ziweiStar] || "orchid";
  const astroFlower = ASTRO_FLOWER_BY_SIGN[zodiacKey] || "daisy";
  const sukuyoFlower = SUKUYO_FLOWER_BY_MANSION[input.sukuyoMansion] || "plum";

  const dominanceGap = (input.elementWeights[input.dominantElement] || 0) - (input.elementWeights[input.lackingElement] || 0);
  const sajuScore = Math.round(clamp(72 + dominanceGap * 0.4, 66, 96));
  const ziweiScore = Math.round(clamp(70 + (input.isBirthTimeKnown ? 8 : 4), 66, 92));
  const astroScore = Math.round(clamp(71 + (input.supportElement === input.dailyElement ? 7 : 4), 66, 92));
  const sukuyoScore = Math.round(clamp(69 + (input.dayElement === input.dailyElement ? 8 : 5), 65, 90));

  const saju = makeResult(
    "saju",
    "만세력 오행 중심축",
    `${ELEMENT_LABEL[input.dominantElement]} 우세`,
    sajuFlower,
    `사주 오행 비율에서 ${ELEMENT_LABEL[input.dominantElement]}가 핵심 축으로 형성되어 ${getFlowerDefinition(sajuFlower).koreanAlias} 상징과 강하게 연결됩니다.`,
    `강점은 ${ELEMENT_NARRATIVE[input.dominantElement]}이며, ${ELEMENT_LABEL[input.lackingElement]}의 보강 루틴을 추가하면 결과가 안정됩니다. ${input.isBirthTimeKnown ? "생시 반영" : "평시 보정"} 상태로 계산해 변동성을 함께 고려했습니다.`,
    `오행 비율 ${ELEMENT_LABEL[input.dominantElement]} ${input.elementWeights[input.dominantElement]}% · ${ELEMENT_LABEL[input.lackingElement]} ${input.elementWeights[input.lackingElement]}%`,
    sajuScore,
    input.dominantElement,
  );

  const ziwei = makeResult(
    "ziwei",
    "자미두수 명궁 교차",
    `${input.ziweiStar} · ${input.ziweiPalace}`,
    ziweiFlower,
    `${input.ziweiStar} 성향이 ${input.ziweiPalace} 축에서 활성화되며 ${getFlowerDefinition(ziweiFlower).koreanAlias}의 분위기와 일치합니다.`,
    `자미두수 교차는 관계의 포지셔닝과 명확한 역할 배치에 강점을 만듭니다. 특히 오늘은 ${input.dailyStemBranch} 일진이 들어와 지연된 결정안의 우선순위를 재정렬하기 유리합니다.`,
    `명궁 신호 ${input.ziweiPalace} · 일진 ${input.dailyStemBranch}`,
    ziweiScore,
    input.supportElement,
  );

  const astro = makeResult(
    "astrology",
    "점성술 성향 공명",
    `${input.sunSignLabel} · ${ZODIAC_GUARDIAN[zodiacKey]}`,
    astroFlower,
    `${zodiacKey} 수호성 결이 ${getFlowerDefinition(astroFlower).koreanAlias} 상징과 맞물려 대외 표현 방식의 선명도를 끌어올립니다.`,
    `점성술 축은 사회적 인상과 첫 반응의 질을 좌우합니다. 오늘은 과장보다 정확한 문장, 빠른 약속보다 확실한 후속이 더 큰 신뢰를 만듭니다.`,
    `별자리 ${zodiacKey} · 보조 오행 ${ELEMENT_LABEL[input.supportElement]}`,
    astroScore,
    input.supportElement,
  );

  const sukuyo = makeResult(
    "sukuyo",
    "숙요 27수 타이밍",
    input.sukuyoMansion,
    sukuyoFlower,
    `숙요 ${input.sukuyoMansion} 흐름이 ${getFlowerDefinition(sukuyoFlower).koreanAlias}와 맞닿아 관계 거리감과 시점 판단의 정확도를 높입니다.`,
    `숙요 결과는 속도 조절과 간격 유지가 핵심입니다. 오늘은 급하게 밀기보다 단계별 체크포인트를 둔 진행이 유리하며, 말보다 기록 중심 커뮤니케이션이 효율적입니다.`,
    `숙요 ${input.sukuyoMansion} · 일간 오행 ${ELEMENT_LABEL[input.dayElement]}`,
    sukuyoScore,
    input.dayElement,
  );

  return [saju, ziwei, astro, sukuyo];
}

export function buildTarotSpread(seed: string, input: DivinationInput, size = 22): TarotFinaleCard[] {
  const rng = mulberry32(hashFromSeed(`${seed}|${input.dailyStemBranch}`));
  const pool = [...TAROT_FINALE_DECK];
  const limit = Math.max(1, Math.min(size, pool.length));
  const picked: TarotFinaleCard[] = [];

  while (picked.length < limit && pool.length > 0) {
    const weightTable = pool.map((card) => computeTarotWeight(card, input));
    const totalWeight = weightTable.reduce((acc, value) => acc + value, 0);
    let cursor = rng() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < pool.length; i += 1) {
      cursor -= weightTable[i];
      if (cursor <= 0) {
        selectedIndex = i;
        break;
      }
    }

    picked.push(pool[selectedIndex]);
    pool.splice(selectedIndex, 1);
  }

  return picked;
}

export function resolveFinalDestinyFlower(
  input: DivinationInput,
  results: DivinationResult[],
  pickedTarot: TarotFinaleCard,
  preferredFlowerId?: string,
): FinalDestinyFlower {
  const scoreByFlower: Record<string, number> = {};

  results.forEach((item) => {
    scoreByFlower[item.flowerId] = (scoreByFlower[item.flowerId] || 0) + item.score;
  });

  pickedTarot.boostFlowerIds.forEach((id) => {
    scoreByFlower[id] = (scoreByFlower[id] || 0) + 24;
  });

  if (preferredFlowerId) {
    scoreByFlower[preferredFlowerId] = (scoreByFlower[preferredFlowerId] || 0) + 18;
  }

  Object.keys(scoreByFlower).forEach((flowerId) => {
    const element = FLOWER_PRIMARY_ELEMENT[flowerId] || input.supportElement;
    const ratioBonus = (input.elementWeights[element] || 0) * 0.34;
    scoreByFlower[flowerId] += ratioBonus;
  });

  const ranked = Object.entries(scoreByFlower).sort((a, b) => b[1] - a[1]);
  const winnerId = ranked[0]?.[0] || "peony";
  const winner = getFlowerDefinition(winnerId);

  const signal = results.map((r) => `${r.subtitle}`).join(" · ");
  const highlightTags = Array.from(
    new Set([
      `${ELEMENT_LABEL[input.dominantElement]} 우세`,
      `${input.ziweiStar}·${input.ziweiPalace}`,
      input.zodiacSign,
      `숙요 ${input.sukuyoMansion}`,
    ]),
  ).slice(0, 4);

  const report = buildLongFormReport(input, winner, results, pickedTarot);

  const finalNarrative = [
    `${input.profileName}님의 사주·자미두수·점성술·숙요 신호가 ${pickedTarot.name} 카드와 공명해 오늘의 운명 꽃은 ${winner.koreanAlias}로 수렴했습니다.`,
    `${winner.story}`,
    `핵심 축은 ${ELEMENT_LABEL[input.dominantElement]} 중심 운용이며, ${signal} 신호를 따라 루틴을 정리하면 ${pickedTarot.effectText}`,
  ].join(" ");

  const shareText = [
    "🌸 나의 운명 꽃 결과",
    `프로필: ${input.profileName}`,
    `최종 꽃: ${winner.koreanAlias} (${winner.name})`,
    `타로 피날레: ${pickedTarot.name} · ${pickedTarot.subtitle}`,
    `핵심 오행: ${ELEMENT_LABEL[input.dominantElement]}(${input.elementWeights[input.dominantElement]}%)`,
    finalNarrative,
    "",
    "[롱폼 리포트 요약]",
    report.opening,
  ].join("\n\n");

  return {
    flowerId: winner.id,
    flowerName: `${winner.koreanAlias} (${winner.name})`,
    aura: winner.aura,
    tarotCardName: pickedTarot.name,
    finalNarrative,
    highlightTags,
    shareText,
    dominantElement: input.dominantElement,
    supportElement: input.supportElement,
    lackingElement: input.lackingElement,
    elementWeights: input.elementWeights,
    report,
  };
}

export const DEFAULT_PROFILE: DestinyProfile = {
  id: "preview-profile",
  name: "데모 사용자",
  gender: "F",
  birth: {
    year: 1995,
    month: 8,
    day: 17,
    hour: 9,
    minute: 25,
    calType: "solar",
  },
  location: {
    label: "대한민국 (서울)",
    tz: "Asia/Seoul",
    lng: 127,
    lat: 37.6,
    tzOffset: 9,
  },
};

export const DEFAULT_INPUT: DivinationInput = deriveDivinationInput(DEFAULT_PROFILE);

export function extractDestinySignals(input: DivinationInput): DestinyExtractedSignals {
  const fallbackNotes: string[] = [];

  if (!input.isBirthTimeKnown) {
    fallbackNotes.push("생시가 없어 평시(12:00) 기준으로 일간/오행을 보정했습니다.");
  }

  if (!input.locationLabel || input.locationLabel.includes("미입력")) {
    fallbackNotes.push("출생지 정보가 없어 기본 시간대(Asia/Seoul) 기준으로 해석했습니다.");
  }

  return {
    dayStem: input.dayStem,
    dayStemElement: input.dayElement,
    ziweiMainStar: input.ziweiMainStar,
    sukuyoMansion: input.sukuyoMansion,
    sunSignKey: input.sunSignKey,
    sunSignLabel: input.sunSignLabel,
    sunSignSymbol: input.sunSignSymbol,
    fallbackNotes,
  };
}

export function formatElementLabel(element: SajuElement): string {
  return ELEMENT_LABEL[element] || element;
}

export function getElementColorHex(element: SajuElement): string {
  return ELEMENT_COLOR_HEX[element] || ELEMENT_COLOR_HEX.earth;
}

export function getElementVisualMeta(element: SajuElement): { icon: string; title: string; effect: string } {
  return ELEMENT_VISUAL_META[element] || ELEMENT_VISUAL_META.earth;
}

export function getElementRatioEntries(weights: ElementWeightMap): Array<{ element: SajuElement; value: number }> {
  return sortElementsByWeight(weights).map((element) => ({
    element,
    value: weights[element],
  }));
}
