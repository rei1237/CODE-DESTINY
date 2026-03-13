import { buildDivinationResults, deriveDivinationInput } from "./flowerData";
import { getCurrentDestinyProfile } from "./profileBridge";
import { DestinyProfile, DivinationInput, DivinationResult, FateAnalysisEngineResult, FateChannelScore, FateFlowerScore } from "./types";

const DEFAULT_FALLBACK_FLOWER_ID = "peony";

const FATE_CHANNEL_WEIGHTS = {
  saju: 0.4,
  ziwei: 0.3,
  astrologySukuyo: 0.3,
} as const;

const ELEMENT_FLOWER_MAP: Record<DivinationInput["dominantElement"], string> = {
  wood: "orchid",
  fire: "rose",
  earth: "chrysanthemum",
  metal: "edelweiss",
  water: "lotus",
};

function toFixedScore(value: number): number {
  return Number(value.toFixed(2));
}

function addScore(scoreMap: Record<string, number>, flowerId: string, score: number) {
  if (!flowerId) return;
  scoreMap[flowerId] = (scoreMap[flowerId] || 0) + score;
}

function findResult(results: DivinationResult[], kind: DivinationResult["kind"]): DivinationResult | undefined {
  return results.find((result) => result.kind === kind);
}

function applyElementBonus(input: DivinationInput, scoreMap: Record<string, number>) {
  addScore(scoreMap, ELEMENT_FLOWER_MAP[input.dominantElement], 8);
  addScore(scoreMap, ELEMENT_FLOWER_MAP[input.supportElement], 4.5);

  if (input.dominantElement === "water" && input.supportElement === "wood") {
    addScore(scoreMap, "lotus", 12);
  }

  if (input.dominantElement === "fire" && input.supportElement === "earth") {
    addScore(scoreMap, "sunflower", 8);
  }

  if (input.dominantElement === "metal" && input.supportElement === "earth") {
    addScore(scoreMap, "edelweiss", 8);
  }

  if (input.dominantElement === "wood" && input.supportElement === "water") {
    addScore(scoreMap, "plum", 8);
  }
}

function getRankedFlowerScores(scoreMap: Record<string, number>): FateFlowerScore[] {
  return Object.entries(scoreMap)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([flowerId, score]) => ({ flowerId, score: toFixedScore(score) }));
}

function resolveFinalFlowerId(scoreMap: Record<string, number>, fallbackId: string): string {
  const ranked = getRankedFlowerScores(scoreMap);
  if (ranked.length > 0) return ranked[0].flowerId;
  return fallbackId || DEFAULT_FALLBACK_FLOWER_ID;
}

export function runFateAnalysisFromProfile(profile: DestinyProfile): FateAnalysisEngineResult {
  const input = deriveDivinationInput(profile);
  const results = buildDivinationResults(input);
  const scoreMap: Record<string, number> = {};

  const saju = findResult(results, "saju");
  const ziwei = findResult(results, "ziwei");
  const astrology = findResult(results, "astrology");
  const sukuyo = findResult(results, "sukuyo");

  const channelScores: FateChannelScore[] = [];

  if (saju) {
    const weighted = saju.score * FATE_CHANNEL_WEIGHTS.saju;
    addScore(scoreMap, saju.flowerId, weighted);
    channelScores.push({
      channel: "saju",
      weight: FATE_CHANNEL_WEIGHTS.saju,
      rawScore: saju.score,
      weightedScore: toFixedScore(weighted),
      candidateFlowerIds: [saju.flowerId],
    });
  } else {
    channelScores.push({
      channel: "saju",
      weight: FATE_CHANNEL_WEIGHTS.saju,
      rawScore: 0,
      weightedScore: 0,
      candidateFlowerIds: [],
    });
  }

  if (ziwei) {
    const weighted = ziwei.score * FATE_CHANNEL_WEIGHTS.ziwei;
    addScore(scoreMap, ziwei.flowerId, weighted);
    channelScores.push({
      channel: "ziwei",
      weight: FATE_CHANNEL_WEIGHTS.ziwei,
      rawScore: ziwei.score,
      weightedScore: toFixedScore(weighted),
      candidateFlowerIds: [ziwei.flowerId],
    });
  } else {
    channelScores.push({
      channel: "ziwei",
      weight: FATE_CHANNEL_WEIGHTS.ziwei,
      rawScore: 0,
      weightedScore: 0,
      candidateFlowerIds: [],
    });
  }

  if (astrology && sukuyo) {
    const astroWeight = FATE_CHANNEL_WEIGHTS.astrologySukuyo / 2;
    const sukuyoWeight = FATE_CHANNEL_WEIGHTS.astrologySukuyo / 2;

    addScore(scoreMap, astrology.flowerId, astrology.score * astroWeight);
    addScore(scoreMap, sukuyo.flowerId, sukuyo.score * sukuyoWeight);

    const rawScore = (astrology.score + sukuyo.score) / 2;
    const weightedScore = rawScore * FATE_CHANNEL_WEIGHTS.astrologySukuyo;

    channelScores.push({
      channel: "astrologySukuyo",
      weight: FATE_CHANNEL_WEIGHTS.astrologySukuyo,
      rawScore: toFixedScore(rawScore),
      weightedScore: toFixedScore(weightedScore),
      candidateFlowerIds: [astrology.flowerId, sukuyo.flowerId],
    });
  } else if (astrology || sukuyo) {
    const singleResult = astrology || sukuyo;
    const weighted = (singleResult?.score || 0) * FATE_CHANNEL_WEIGHTS.astrologySukuyo;

    if (singleResult) {
      addScore(scoreMap, singleResult.flowerId, weighted);
    }

    channelScores.push({
      channel: "astrologySukuyo",
      weight: FATE_CHANNEL_WEIGHTS.astrologySukuyo,
      rawScore: singleResult?.score || 0,
      weightedScore: toFixedScore(weighted),
      candidateFlowerIds: singleResult ? [singleResult.flowerId] : [],
    });
  } else {
    channelScores.push({
      channel: "astrologySukuyo",
      weight: FATE_CHANNEL_WEIGHTS.astrologySukuyo,
      rawScore: 0,
      weightedScore: 0,
      candidateFlowerIds: [],
    });
  }

  applyElementBonus(input, scoreMap);

  const finalFlowerId = resolveFinalFlowerId(scoreMap, saju?.flowerId || DEFAULT_FALLBACK_FLOWER_ID);

  return {
    input,
    results,
    channelScores,
    weightedConfig: {
      saju: 40,
      ziwei: 30,
      astrologySukuyo: 30,
    },
    finalFlowerId,
    rankedFlowerScores: getRankedFlowerScores(scoreMap),
  };
}

export function runFateAnalysisFromUserProfile(): FateAnalysisEngineResult | null {
  const profile = getCurrentDestinyProfile();
  if (!profile) return null;
  return runFateAnalysisFromProfile(profile);
}
