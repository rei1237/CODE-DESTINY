"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import styles from "./destiny-flower.module.css";
import { getElementColorHex } from "./flowerData";
import type { SajuElement } from "./types";

interface FlowerCanvasProps {
  bloomStage: 0 | 1 | 2 | 3;
  dayStemElement?: SajuElement;
  dominantElement?: SajuElement;
  ziweiMainStar?: string;
  sunSignSymbol?: string;
  onClick?: () => void;
}

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const ELEMENT_PARTICLE_X = [8, 18, 27, 36, 48, 59, 71, 82, 91, 96];

const PARTICLE_LAYER_CLASS: Record<SajuElement, string> = {
  wood: styles.particleLayerWood,
  fire: styles.particleLayerFire,
  earth: styles.particleLayerEarth,
  metal: styles.particleLayerMetal,
  water: styles.particleLayerWater,
};

const PARTICLE_ITEM_CLASS: Record<SajuElement, string> = {
  wood: styles.particleWood,
  fire: styles.particleFire,
  earth: styles.particleEarth,
  metal: styles.particleMetal,
  water: styles.particleWater,
};

const PETAL_SCALE: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 0.18,
  2: 0.58,
  3: 1,
};

const PETAL_OPACITY: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 0.65,
  2: 0.85,
  3: 1,
};

const TOUCH_HINT: Record<0 | 1 | 2, string> = {
  0: "✦ 터치하여 씨앗을 깨워보세요",
  1: "✦ 별의 기운이 모이고 있습니다",
  2: "✦ 별자리의 형상이 나타납니다",
};

type ParticleStyle = CSSProperties & {
  "--particle-x": string;
  "--particle-size": string;
  "--particle-delay": string;
  "--particle-color": string;
};

function ElementParticleLayer({
  activeElement,
  elementColor,
  bloomStage,
}: {
  activeElement: SajuElement;
  elementColor: string;
  bloomStage: 0 | 1 | 2 | 3;
}) {
  const layerClass = PARTICLE_LAYER_CLASS[activeElement];
  const particleClass = PARTICLE_ITEM_CLASS[activeElement];
  const particleCount = bloomStage >= 3 ? 10 : 7;

  return (
    <div className={`${styles.elementParticleLayer} ${layerClass}`} aria-hidden="true">
      {ELEMENT_PARTICLE_X.slice(0, particleCount).map((x, index) => {
        const style: ParticleStyle = {
          "--particle-x": `${x}%`,
          "--particle-size": `${bloomStage >= 3 ? 8 + (index % 3) : 6 + (index % 2)}px`,
          "--particle-delay": `${(index % 6) * 0.34}s`,
          "--particle-color": elementColor,
        };

        return (
          <span
            key={`${activeElement}-${index}`}
            className={`${styles.elementParticle} ${particleClass}`}
            style={style}
          />
        );
      })}
    </div>
  );
}

export function FlowerCanvas({
  bloomStage,
  dayStemElement = "fire",
  dominantElement,
  ziweiMainStar,
  sunSignSymbol,
  onClick,
}: FlowerCanvasProps) {
  const activeElement = dominantElement ?? dayStemElement;
  const elementColor = getElementColorHex(activeElement);
  const clickable = bloomStage < 3 && !!onClick;

  const centerLabel =
    bloomStage >= 2 && ziweiMainStar ? ziweiMainStar.slice(0, 2) : "✦";

  const glowShadow =
    bloomStage >= 3
      ? [
          `0 0 28px 10px ${elementColor}88, 0 0 64px 22px ${elementColor}44`,
          `0 0 44px 16px ${elementColor}aa, 0 0 90px 32px ${elementColor}55`,
          `0 0 28px 10px ${elementColor}88, 0 0 64px 22px ${elementColor}44`,
        ]
      : bloomStage >= 2
      ? `0 0 18px 6px ${elementColor}66`
      : `0 0 8px 3px ${elementColor}44`;

  return (
    <div
      className={styles.flowerCanvas}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? "운명의 꽃을 터치하여 개화하세요" : "운명의 꽃"}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
    >
      {/* Localized star field */}
      <div className={styles.flowerStarField} aria-hidden="true" />

      {/* Zodiac symbol floating above — stage 3 */}
      <AnimatePresence>
        {bloomStage >= 3 && sunSignSymbol && (
          <motion.div
            className={styles.flowerZodiacFloat}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.3, ease: [0.18, 0.83, 0.34, 1] }}
          >
            <span className={styles.flowerZodiacRing}>{sunSignSymbol}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aura ring with particles — stage 2+ */}
      <AnimatePresence>
        {bloomStage >= 2 && (
          <>
            <motion.div
              className={styles.flowerAuraRing}
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.35 }}
              transition={{ duration: 1.4, ease: [0.18, 0.83, 0.34, 1] }}
              style={{ borderColor: `${elementColor}55` } as CSSProperties}
            >
              {PARTICLE_ANGLES.map((angle) => (
                <span
                  key={angle}
                  className={styles.flowerParticle}
                  style={{
                    transform: `rotate(${angle}deg) translateX(78px)`,
                    backgroundColor: elementColor,
                    boxShadow: `0 0 5px 2px ${elementColor}88`,
                  }}
                />
              ))}
            </motion.div>
            <ElementParticleLayer
              activeElement={activeElement}
              elementColor={elementColor}
              bloomStage={bloomStage}
            />
          </>
        )}
      </AnimatePresence>

      {/* Petals */}
      <div className={styles.flowerPetalsWrap}>
        {PETAL_ANGLES.map((angle, i) => (
          <div
            key={angle}
            className={styles.petalWrapper}
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <motion.div
              className={styles.flowerPetal}
              style={{
                background: `linear-gradient(to top, ${elementColor}22, ${elementColor}aa 65%, ${elementColor}dd)`,
                originY: 1,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: PETAL_SCALE[bloomStage],
                opacity: PETAL_OPACITY[bloomStage],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: [0.18, 0.83, 0.34, 1],
              }}
            />
          </div>
        ))}
      </div>

      {/* Stem — stage 1+ */}
      <AnimatePresence>
        {bloomStage >= 1 && (
          <motion.div
            className={styles.flowerStem}
            style={{ backgroundColor: elementColor, originY: 1 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.12 }}
          />
        )}
      </AnimatePresence>

      {/* Center sphere — always present */}
      <motion.div
        className={styles.flowerCenter}
        style={{
          background: `radial-gradient(circle at 38% 35%, rgba(255, 245, 180, 0.92), ${elementColor} 78%)`,
        }}
        animate={{
          boxShadow: glowShadow,
          scale: bloomStage >= 3 ? [1, 1.07, 1] : 1,
        }}
        transition={{
          scale: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
          boxShadow: { duration: 0.9 },
        }}
      >
        <span className={styles.flowerCenterLabel}>{centerLabel}</span>
      </motion.div>

      {/* Touch hint — while blooming */}
      {bloomStage < 3 && (
        <motion.p
          className={styles.flowerTouchHint}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          {TOUCH_HINT[bloomStage as 0 | 1 | 2]}
        </motion.p>
      )}
    </div>
  );
}
