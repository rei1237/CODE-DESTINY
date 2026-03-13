"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./destiny-flower.module.css";
import { useDestinyFlower } from "./DestinyFlowerContext";
import { TarotPickCanvas } from "./TarotPickCanvas";
import { FlowerCanvas } from "./FlowerCanvas";
import { getFlowerImageAt, getFlowerImageCandidates, getFlowerThemeTokens } from "./flowerAssetMap";
import { formatElementLabel, getElementColorHex } from "./flowerData";
import { LongFormReport } from "./LongFormReport";
import { DivinationResultCard } from "./DivinationResultCard";
import { formatProfileBirth } from "./profileBridge";
import type { DiscoveryPhaseKey } from "./types";

type FlowerThemeStyle = CSSProperties & {
  "--flower-bg": string;
  "--flower-accent": string;
  "--flower-font-color": string;
  "--flower-glow": string;
  "--flower-font-family": string;
};

// ── 블룸 스테이지 헬퍼 ─────────────────────────────────────────────────────
function getBloomStage(confirmedCount: number): 0 | 1 | 2 | 3 {
  if (confirmedCount >= 3) return 3;
  return confirmedCount as 0 | 1 | 2;
}

const BLOOM_LABEL = ["발아", "발아", "성장", "만개"] as const;
const BLOOM_SUBTITLE = ["Germination", "Germination", "Growth", "Full Bloom"] as const;

interface StoryEntry { label: string; title: string; body: string }
const STORY: Record<0 | 1 | 2 | 3, StoryEntry> = {
  0: { label: "뿌리의 형상 (사주)", title: "사주 四柱", body: "천문의 궤적이 당신의 씨앗에 닿고 있습니다." },
  1: { label: "꽃잎의 빛깔 (자미두수)", title: "자미두수 · 숙요", body: "별무리의 빛이 씨앗 속으로 스며들기 시작합니다." },
  2: { label: "향기의 근원 (점성술)", title: "태양 별자리", body: "천체의 형상이 마지막 조각을 채웁니다." },
  3: { label: "만개", title: "운명의 꽃", body: "오늘 당신이라는 정원에 꽃이 완전히 피었습니다." },
};

// ── 캔버스 카드 저장 헬퍼 ────────────────────────────────────────────────────
function createFinalCardCanvasUrl(options: {
  flowerName: string;
  aura: string;
  tarotCardName: string;
  narrative: string;
  imageSources?: string[];
}): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) { resolve(""); return; }

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#0d1322");
    bg.addColorStop(0.5, "#0a0e14");
    bg.addColorStop(1, "#10162a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 별 점 장식
    ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1080, Math.random() * 700, 0.8 + Math.random() * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const drawText = () => {
      ctx.strokeStyle = "rgba(201, 168, 76, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(90, 766); ctx.lineTo(990, 766); ctx.stroke();

      ctx.fillStyle = "rgba(255, 249, 224, 0.94)";
      ctx.font = "700 52px system-ui, sans-serif";
      ctx.fillText("운명의 꽃", 90, 836);

      ctx.fillStyle = "#e8c96d";
      ctx.font = "600 44px system-ui, sans-serif";
      ctx.fillText(options.flowerName, 90, 904);

      ctx.fillStyle = "rgba(201, 168, 76, 0.78)";
      ctx.font = "500 30px system-ui, sans-serif";
      ctx.fillText("아우라 · " + options.aura, 90, 958);

      ctx.fillStyle = "rgba(180, 150, 100, 0.7)";
      ctx.font = "600 27px system-ui, sans-serif";
      ctx.fillText("Tarot: " + options.tarotCardName, 90, 1006);

      ctx.fillStyle = "rgba(255, 249, 224, 0.65)";
      ctx.font = "500 25px system-ui, sans-serif";
      let y = 1058; let line = "";
      for (const char of options.narrative.slice(0, 200)) {
        const test = line + char;
        if (ctx.measureText(test).width > 900) {
          ctx.fillText(line, 90, y); y += 38; line = char;
          if (y > 1350) break;
        } else { line = test; }
      }
      if (line && y <= 1350) ctx.fillText(line, 90, y);

      ctx.fillStyle = "rgba(201, 168, 76, 0.38)";
      ctx.font = "500 21px system-ui, sans-serif";
      ctx.fillText("Code Destiny · Celestial Bloom", 90, 1406);
      resolve(canvas.toDataURL("image/png"));
    };

    const srcs = (options.imageSources ?? []).filter(Boolean);
    if (!srcs.length) { drawText(); return; }

    const img = new Image();
    img.onload = () => {
      const cw = 900, ch = 640, cx = 90, cy = 90;
      const r = Math.min(cw / img.width, ch / img.height);
      ctx.drawImage(img, cx + (cw - img.width * r) / 2, cy + (ch - img.height * r) / 2, img.width * r, img.height * r);
      drawText();
    };
    img.onerror = drawText;
    img.src = srcs[0];
  });
}

// ── 메인 컨테이너 ─────────────────────────────────────────────────────────────
export function FlowerFortuneContainer() {
  const {
    profileStatus,
    profile,
    analysis,
    tarot,
    stage,
    reloadProfile,
    confirmPhase,
    runAnalysis,
    proceedToTarot,
    pickTarot,
    restart,
  } = useDestinyFlower();

  const discovery = analysis.discovery;
  const phaseConfirmed = analysis.phaseConfirmed;
  const finalFlower = tarot.finalFlower;
  const pickedTarot = tarot.picked;

  const [isSaving, setIsSaving] = useState(false);
  const [isTarotSaving, setIsTarotSaving] = useState(false);
  const tarotSaveCaptureRef = useRef<HTMLDivElement | null>(null);

  const confirmedCount = useMemo(
    () => Object.values(phaseConfirmed).filter(Boolean).length,
    [phaseConfirmed],
  );
  const allPhasesConfirmed = confirmedCount >= 3;
  const bloomStage = getBloomStage(confirmedCount);

  const activeThemeFlowerId = useMemo(() => {
    if (finalFlower?.flowerId) return finalFlower.flowerId;
    if (analysis.results.length > 0) return analysis.results[0].flowerId;
    return undefined;
  }, [analysis.results, finalFlower?.flowerId]);

  const pageThemeStyle = useMemo(() => {
    const dominantElement =
      finalFlower?.dominantElement ??
      analysis.input?.dominantElement ??
      discovery?.dayStemElement ??
      "earth";
    const fallbackAccent = getElementColorHex(dominantElement);
    const themeTokens = activeThemeFlowerId ? getFlowerThemeTokens(activeThemeFlowerId) : undefined;
    const fontFamily =
      themeTokens?.fontFamily ??
      (dominantElement === "water" || dominantElement === "wood"
        ? '"MaruBuri", "Noto Serif KR", serif'
        : '"Pretendard", "Noto Sans KR", system-ui, sans-serif');

    return {
      "--flower-bg": themeTokens?.background ?? "#0a0e14",
      "--flower-accent": themeTokens?.accent ?? fallbackAccent,
      "--flower-font-color": themeTokens?.fontColor ?? "rgba(255, 249, 224, 0.9)",
      "--flower-glow": themeTokens?.glow ?? `${fallbackAccent}77`,
      "--flower-font-family": fontFamily,
    } as FlowerThemeStyle;
  }, [
    activeThemeFlowerId,
    analysis.input?.dominantElement,
    discovery?.dayStemElement,
    finalFlower?.dominantElement,
  ]);

  const nextPhase = useMemo((): DiscoveryPhaseKey | null => {
    if (!phaseConfirmed.saju) return "saju";
    if (!phaseConfirmed.ziweiSukuyo) return "ziweiSukuyo";
    if (!phaseConfirmed.astrology) return "astrology";
    return null;
  }, [phaseConfirmed]);

  const handleFlowerTouch = () => {
    if (nextPhase && stage === "input") confirmPhase(nextPhase);
  };

  const handleSave = async () => {
    if (!finalFlower) return;
    setIsSaving(true);
    try {
      const candidates = getFlowerImageCandidates(finalFlower.flowerId);
      const pngUrl = await createFinalCardCanvasUrl({
        flowerName: finalFlower.flowerName,
        aura: finalFlower.aura,
        tarotCardName: finalFlower.tarotCardName,
        narrative: finalFlower.finalNarrative + " " + finalFlower.report.opening,
        imageSources: candidates,
      });
      if (pngUrl) {
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "destiny-flower-" + Date.now() + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTarotCard = async () => {
    if (!tarotSaveCaptureRef.current || !finalFlower || !pickedTarot) return;

    setIsTarotSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(tarotSaveCaptureRef.current, {
        backgroundColor: "#0d1322",
        useCORS: true,
        logging: false,
        scale: Math.max(2, Math.min(3, window.devicePixelRatio || 2)),
      });

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `today-flower-tarot-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("카드 저장에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsTarotSaving(false);
    }
  };

  const handleShare = async () => {
    if (!finalFlower) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "나의 운명 꽃", text: finalFlower.shareText, url: window.location.href });
        return;
      } catch { /* fallthrough */ }
    }
    try {
      await navigator.clipboard.writeText(finalFlower.shareText);
      alert("운명 꽃 결과 텍스트가 복사됐어요!");
    } catch {
      alert("공유하지 못하는 환경입니다.");
    }
  };

  const storyEntry = STORY[bloomStage];

  return (
    <main className={styles.pageWrap} style={pageThemeStyle}>
      {/* 그레인 노이즈 오버레이 */}
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ✦ 천상 헤더 ✦ */}
      <header className={styles.celestialHeader}>
        <div className={styles.headerBadge}>✦ CELESTIAL BLOOM</div>
        <h1 className={styles.headerTitle}>운명의 꽃</h1>
        <p className={styles.headerSubtitle}>당신이라는 정원에서 피어나는 별들의 기록</p>
      </header>

      {/* 로딩 */}
      {profileStatus === "loading" && (
        <div className={styles.loadingBloomPanel} role="status" aria-live="polite">
          <div className={styles.loadingBloomScene} aria-hidden="true">
            <div className={styles.loadingBloomHalo} />
            <div className={styles.loadingBloomPetalField}>
              {Array.from({ length: 12 }).map((_, index) => (
                <span
                  key={`loading-bloom-petal-${index}`}
                  className={styles.loadingBloomPetal}
                  style={
                    {
                      "--petal-rotate": `${index * 30}deg`,
                      "--petal-delay": `${index * 0.14}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className={styles.loadingBloomGlow} />
            <div className={styles.loadingBloomCore} />
          </div>

          <p className={styles.loadingBloomText}>당신의 운명 씨앗이 꽃잎을 펼치는 중...</p>
          <small className={styles.loadingBloomSubtext}>
            천문의 궤적과 점술 신호를 정렬하고 있습니다. 잠시만 기다려 주세요.
          </small>
        </div>
      )}

      {/* 프로필 없음 */}
      {profileStatus === "missing" && (
        <div className={styles.missingGardenPanel}>
          <div className={styles.missingGardenIcon}>🌱</div>
          <p>아직 정원에 씨앗이 심기지 않았습니다.</p>
          <small>
            메인 화면에서 사주 정보를 입력해 운명의 정원을 완성한 뒤{" "}
            다시 이 정원으로 돌아와 주세요.
          </small>
          <div className={styles.missingActions}>
            <Link href="/" className={styles.gardenLink}>정원으로 이동</Link>
            <button type="button" className={styles.gardenButton} onClick={reloadProfile}>다시 확인</button>
          </div>
        </div>
      )}

      {/* 메인 정원 */}
      {profileStatus === "ready" && discovery && (
        <>
          {/* INPUT 스테이지 – 블루밍 여정 */}
          {stage === "input" && (
            <div className={styles.flowerCanvasWrap}>
              {/* 블룸 스테이지마다 바뀌는 신호 어노테이션 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={"signal-" + bloomStage}
                  className={styles.signalAnnotation}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                >
                  <span className={styles.signalLabel}>{storyEntry.label}</span>
                  {bloomStage === 0 && (
                    <>
                      <p style={{ color: getElementColorHex(discovery.dayStemElement) }}>
                        {discovery.dayStem} 일간 · {formatElementLabel(discovery.dayStemElement)}
                      </p>
                      <small>{storyEntry.body}</small>
                    </>
                  )}
                  {bloomStage === 1 && (
                    <>
                      <p>{discovery.ziweiMainStar}</p>
                      <small>숙요 {discovery.sukuyoMansion} · {storyEntry.body}</small>
                    </>
                  )}
                  {bloomStage === 2 && (
                    <>
                      <p>{discovery.sunSignSymbol} {discovery.sunSignLabel}</p>
                      <small>{storyEntry.body}</small>
                    </>
                  )}
                  {bloomStage === 3 && (
                    <>
                      <p>{storyEntry.title}</p>
                      <small>{storyEntry.body}</small>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <p className={styles.bloomStageLabel}>
                {BLOOM_LABEL[bloomStage]} · {BLOOM_SUBTITLE[bloomStage]}
              </p>

              {/* 인터랙티브 꽃 캔버스 */}
              <FlowerCanvas
                bloomStage={bloomStage}
                dayStemElement={discovery.dayStemElement}
                dominantElement={analysis.input?.dominantElement}
                ziweiMainStar={discovery.ziweiMainStar}
                sunSignSymbol={discovery.sunSignSymbol}
                onClick={!allPhasesConfirmed ? handleFlowerTouch : undefined}
              />

              {/* 만개 후 CTA */}
              <AnimatePresence>
                {allPhasesConfirmed && (
                  <motion.button
                    className={styles.gardenCTA}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.55, duration: 0.65 }}
                    onClick={runAnalysis}
                  >
                    사주·자미두수·숙요·점성술 꽃 특징 분석 보기
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* RESULTS 스테이지 – 4대 점술 특징 + 꽃 타임라인 */}
          {stage === "results" && analysis.results.length > 0 && analysis.input && (
            <motion.section
              className={styles.resultsStageWrap}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <header className={styles.resultsHeader}>
                <div className={styles.resultsBadge}>✦ FLORAL DESTINY TIMELINE</div>
                <h3>당신의 점술 특징이 꽃으로 개화되는 여정</h3>
                <p>
                  사주 · 자미두수 · 숙요 · 점성술 신호를 종합해 꽃 상징으로 번역했습니다.
                  마지막에 3장의 카드 중 1장을 뽑아 오늘의 운세를 확정합니다.
                </p>
              </header>

              <div className={styles.profileSnapshot}>
                <div>
                  <span>프로필</span>
                  <strong>{analysis.input.profileName}</strong>
                  <em>{profile ? formatProfileBirth(profile) : analysis.input.birthLabel}</em>
                </div>
                <div>
                  <span>출생지</span>
                  <strong>{analysis.input.locationLabel}</strong>
                  <em>{analysis.input.isBirthTimeKnown ? "생시 반영" : "평시(12:00) 보정"}</em>
                </div>
              </div>

              <div className={styles.crossSignalPanel}>
                {analysis.input.crossSignals.map((signal, idx) => (
                  <p key={signal + idx}>🌸 {signal}</p>
                ))}
              </div>

              <div className={styles.oracleTimeline}>
                <div className={styles.timelineLine} aria-hidden="true" />
                {analysis.results.map((result, index) => (
                  <section key={result.kind} className={styles.timelineNode}>
                    <div className={styles.timelineBloom} style={{ borderColor: `${result.accentHex}77` }}>
                      <span style={{ color: result.accentHex }}>✿</span>
                      <small>{result.title}</small>
                    </div>
                    <div className={styles.timelineCardWrap}>
                      <DivinationResultCard result={result} order={index} />
                    </div>
                  </section>
                ))}
              </div>

              <div className={styles.resultStageActions}>
                <button type="button" className={styles.resultPrimaryBtn} onClick={proceedToTarot}>
                  3장의 꽃 카드에서 하루 운세 뽑기
                </button>
                <button type="button" className={styles.resultGhostBtn} onClick={restart}>
                  분석 다시 시작
                </button>
              </div>
            </motion.section>
          )}

          {/* TAROT 스테이지 – 3장 카드 */}
          {stage === "tarot" && tarot.spread.length > 0 && (
            <motion.div
              className={styles.tarotStageWrap}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className={styles.tarotFlowerMini}>
                <FlowerCanvas
                  bloomStage={3}
                  dayStemElement={discovery.dayStemElement}
                  dominantElement={analysis.input?.dominantElement}
                  ziweiMainStar={discovery.ziweiMainStar}
                  sunSignSymbol={discovery.sunSignSymbol}
                />
              </div>
              <TarotPickCanvas
                cards={tarot.spread.slice(0, 3)}
                selectedCardId={pickedTarot?.id}
                onPick={pickTarot}
              />
            </motion.div>
          )}

          {/* FINALE 스테이지 */}
          {stage === "final" && finalFlower && (
            <motion.section
              className={styles.finaleSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className={styles.finaleStars} aria-hidden="true" />
              <div className={styles.finaleNoise} aria-hidden="true" />

              <FlowerCanvas
                bloomStage={3}
                dayStemElement={discovery.dayStemElement}
                dominantElement={finalFlower.dominantElement}
                ziweiMainStar={discovery.ziweiMainStar}
                sunSignSymbol={discovery.sunSignSymbol}
              />

              <div className={styles.finaleCard}>
                <h2>오늘 당신이라는 정원에 핀 꽃</h2>
                <h3>{finalFlower.flowerName}</h3>
                <p className={styles.aura}>아우라 · {finalFlower.aura}</p>
                <p className={styles.finalNarrative}>{finalFlower.finalNarrative}</p>
                <div className={styles.tagRow}>
                  {finalFlower.highlightTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <LongFormReport report={finalFlower.report} />

                <section className={styles.todayTarotSection}>
                  <TarotPickCanvas
                    cards={tarot.spread.slice(0, 3)}
                    selectedCardId={pickedTarot?.id}
                    onPick={pickTarot}
                    lockAfterPick={false}
                    title="🌸 오늘의 꽃 타로"
                    description={
                      <>
                        오늘 일진 {analysis.input?.dailyStemBranch ?? "-"} 가중치를 반영해 배치된 3장의 꽃 카드입니다.<br />
                        원하는 카드를 다시 선택하면 오늘의 꽃 문구와 결과 카드가 즉시 갱신됩니다.
                      </>
                    }
                  />

                  <div className={styles.tarotSaveArea}>
                    <div className={styles.tarotSaveCard} ref={tarotSaveCaptureRef}>
                      <img
                        src={getFlowerImageAt(finalFlower.flowerId, 0)}
                        alt={finalFlower.flowerName}
                        className={styles.tarotSaveImage}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={styles.tarotSaveTextBox}>
                        <span>오늘의 선택</span>
                        <strong>{pickedTarot?.name ?? "Tarot"} · {finalFlower.flowerName}</strong>
                        <p>{pickedTarot?.reveal ?? finalFlower.finalNarrative.slice(0, 120)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.tarotSaveButton}
                      onClick={handleSaveTarotCard}
                      disabled={isTarotSaving}
                    >
                      {isTarotSaving ? "저장 중..." : "카드 저장하기"}
                    </button>
                  </div>
                </section>

                <div className={styles.finalActions}>
                  <button type="button" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "생성 중..." : "🖼 카드 저장"}
                  </button>
                  <button type="button" onClick={handleShare}>📤 공유</button>
                  <button type="button" onClick={restart}>🔄 다시 분석</button>
                </div>
              </div>
            </motion.section>
          )}
        </>
      )}
    </main>
  );
}
