export type SajuElement = "wood" | "fire" | "earth" | "metal" | "water";

export type AstrologySunSignKey =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export interface DestinyProfileBirth {
  year: number;
  month: number;
  day: number;
  hour?: number | null;
  minute?: number | null;
  calType?: string;
}

export interface DestinyProfileLocation {
  label?: string;
  tz?: string;
  lng?: number;
  lat?: number;
  tzOffset?: number;
  baseTzOffset?: number;
  dstMinutes?: number;
}

export interface DestinyProfile {
  id?: string;
  name: string;
  gender?: string;
  birth: DestinyProfileBirth;
  location?: DestinyProfileLocation;
}

export type ElementWeightMap = Record<SajuElement, number>;

export interface DivinationInput {
  profileId: string;
  profileName: string;
  gender: string;
  birthLabel: string;
  locationLabel: string;
  dayStem: string;
  dominantElement: SajuElement;
  supportElement: SajuElement;
  lackingElement: SajuElement;
  dayElement: SajuElement;
  dailyElement: SajuElement;
  elementWeights: ElementWeightMap;
  ziweiMainStar: string;
  ziweiStar: string;
  ziweiPalace: string;
  sunSignKey: AstrologySunSignKey;
  sunSignLabel: string;
  sunSignSymbol: string;
  zodiacSign: string;
  sukuyoMansion: string;
  dailyStemBranch: string;
  crossSignals: string[];
  baseSeed: string;
  isBirthTimeKnown: boolean;
}

export interface DestinyExtractedSignals {
  dayStem: string;
  dayStemElement: SajuElement;
  ziweiMainStar: string;
  sukuyoMansion: string;
  sunSignKey: AstrologySunSignKey;
  sunSignLabel: string;
  sunSignSymbol: string;
  fallbackNotes: string[];
}

export type DivinationKind = "saju" | "ziwei" | "astrology" | "sukuyo";

export interface DivinationResult {
  kind: DivinationKind;
  title: string;
  subtitle: string;
  flowerId: string;
  flowerName: string;
  summary: string;
  details: string;
  basisLine: string;
  score: number;
  accentHex: string;
  element: SajuElement;
}

export interface FlowerDefinition {
  id: string;
  name: string;
  koreanAlias: string;
  aura: string;
  palette: [string, string];
  story: string;
}

export interface TarotFinaleCard {
  id: string;
  arcanaNo: number;
  name: string;
  subtitle: string;
  reveal: string;
  boostFlowerIds: string[];
  effectText: string;
  affinityElements: SajuElement[];
  baseWeight: number;
}

export interface LongFormSection {
  title: string;
  body: string;
}

export interface LongFormReport {
  opening: string;
  sections: LongFormSection[];
  closing: string;
  totalLength: number;
  fullText: string;
}

export interface FinalDestinyFlower {
  flowerId: string;
  flowerName: string;
  aura: string;
  finalNarrative: string;
  tarotCardName: string;
  highlightTags: string[];
  shareText: string;
  dominantElement: SajuElement;
  supportElement: SajuElement;
  lackingElement: SajuElement;
  elementWeights: ElementWeightMap;
  report: LongFormReport;
}

export type FateChannelKey = "saju" | "ziwei" | "astrologySukuyo";

export interface FateChannelScore {
  channel: FateChannelKey;
  weight: number;
  rawScore: number;
  weightedScore: number;
  candidateFlowerIds: string[];
}

export interface FateFlowerScore {
  flowerId: string;
  score: number;
}

export interface FateAnalysisEngineResult {
  input: DivinationInput;
  results: DivinationResult[];
  channelScores: FateChannelScore[];
  weightedConfig: {
    saju: number;
    ziwei: number;
    astrologySukuyo: number;
  };
  finalFlowerId: string;
  rankedFlowerScores: FateFlowerScore[];
}

export type DestinyFlowerStage = "input" | "results" | "tarot" | "final";

export type DiscoveryPhaseKey = "saju" | "ziweiSukuyo" | "astrology";

export type ProfileStatus = "loading" | "ready" | "missing";

export interface DestinyAnalysisStore {
  input?: DivinationInput;
  discovery?: DestinyExtractedSignals;
  fateAnalysis?: FateAnalysisEngineResult;
  phaseConfirmed: Record<DiscoveryPhaseKey, boolean>;
  results: DivinationResult[];
}

export interface DestinyTarotStore {
  spread: TarotFinaleCard[];
  picked?: TarotFinaleCard;
  finalFlower?: FinalDestinyFlower;
}

export interface DestinyFlowerState {
  profileStatus: ProfileStatus;
  profile?: DestinyProfile;
  analysis: DestinyAnalysisStore;
  tarot: DestinyTarotStore;
  stage: DestinyFlowerStage;
}
