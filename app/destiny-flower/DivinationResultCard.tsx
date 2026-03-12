"use client";

import { memo, useMemo, useState } from "react";
import styles from "./destiny-flower.module.css";
import { formatElementLabel } from "./flowerData";
import { getFlowerImageAt, getFlowerImageCandidates } from "./flowerAssetMap";
import { DivinationResult } from "./types";

interface DivinationResultCardProps {
  result: DivinationResult;
  order: number;
}

export const DivinationResultCard = memo(function DivinationResultCard({ result, order }: DivinationResultCardProps) {
  const [assetIndex, setAssetIndex] = useState<number>(0);
  const candidates = useMemo(() => getFlowerImageCandidates(result.flowerId), [result.flowerId]);
  const imageSrc = getFlowerImageAt(result.flowerId, assetIndex);

  return (
    <article
      className={styles.divinationCard}
      style={{
        animationDelay: `${order * 120}ms`,
        borderColor: `${result.accentHex}66`,
      }}
    >
      <div className={styles.divinationHead}>
        <span className={styles.divinationChip}>{result.title}</span>
        <span className={styles.divinationSubtitle}>{result.subtitle}</span>
      </div>

      <div className={styles.resultMetaRow}>
        <span className={styles.elementTag}>{formatElementLabel(result.element)}</span>
        <strong className={styles.scorePill}>{result.score}점</strong>
      </div>

      <div className={styles.bloomFrame}>
        <img
          src={imageSrc}
          alt={result.flowerName}
          className={styles.bloomImage}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (assetIndex < candidates.length - 1) {
              setAssetIndex((prev: number) => prev + 1);
            }
          }}
        />
        <div className={styles.pollenLayer} aria-hidden="true" />
      </div>

      <h3 className={styles.flowerName}>{result.flowerName}</h3>
      <p className={styles.flowerSummary}>{result.summary}</p>
      <p className={styles.flowerDetails}>{result.details}</p>
      <p className={styles.basisLine}>{result.basisLine}</p>

      <div className={styles.scoreBar} role="img" aria-label={`${result.title} ${result.score}점`}>
        <span style={{ width: `${Math.max(0, Math.min(100, result.score))}%`, background: result.accentHex }} />
      </div>
    </article>
  );
});
