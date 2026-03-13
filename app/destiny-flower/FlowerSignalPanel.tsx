import styles from "./destiny-flower.module.css";
import {
  formatElementLabel,
  getFlowerDefinition,
} from "./flowerData";
import type { SajuElement } from "./types";

interface FlowerSignalPanelProps {
  monthNumber: number;
  seasonLabel: string;
  monthFlowerIds: string[];
  elementWeights: Record<SajuElement, number>;
  dominantElement: SajuElement;
  supportingElement: SajuElement;
  lackingElement: SajuElement;
}

const ELEMENT_ORDER: SajuElement[] = ["wood", "fire", "earth", "metal", "water"];

export function FlowerSignalPanel(props: FlowerSignalPanelProps) {
  const {
    monthNumber,
    seasonLabel,
    monthFlowerIds,
    elementWeights,
    dominantElement,
    supportingElement,
    lackingElement,
  } = props;

  const sortedMonthFlowers = monthFlowerIds
    .map((id) => getFlowerDefinition(id))
    .filter((flower): flower is NonNullable<typeof flower> => Boolean(flower));

  return (
    <section className={styles.flowerSignalPanel} aria-label="출생 시그널 기반 추천">
      <div className={styles.signalHead}>
        <span>Birth Signature</span>
        <strong>{monthNumber}월 · {seasonLabel} 에너지</strong>
      </div>

      <div className={styles.signalBadgeRow}>
        <span className={styles.signalBadge}>강점: {formatElementLabel(dominantElement)}</span>
        <span className={styles.signalBadge}>보완: {formatElementLabel(supportingElement)}</span>
        <span className={styles.signalBadge}>부족: {formatElementLabel(lackingElement)}</span>
      </div>

      <div className={styles.elementMeterList}>
        {ELEMENT_ORDER.map((element) => {
          const ratio = Math.min(1, Math.max(0, elementWeights[element] / 1.6));
          return (
            <div key={element} className={styles.elementMeterItem}>
              <span>{formatElementLabel(element)}</span>
              <div className={styles.elementMeterTrack}>
                <i style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.monthFlowerChips}>
        {sortedMonthFlowers.map((flower) => (
          <span key={flower.id}>{flower.name}</span>
        ))}
      </div>
    </section>
  );
}
