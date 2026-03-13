"use client";

import { memo, type ReactNode } from "react";
import styles from "./destiny-flower.module.css";
import { getTarotCardImage } from "./flowerAssetMap";
import type { TarotFinaleCard } from "./types";

interface TarotPickCanvasProps {
  cards: TarotFinaleCard[];
  selectedCardId?: string;
  onPick: (cardId: string) => void;
  title?: string;
  description?: ReactNode;
  lockAfterPick?: boolean;
}

export const TarotPickCanvas = memo(function TarotPickCanvas({
  cards,
  selectedCardId,
  onPick,
  title,
  description,
  lockAfterPick = true,
}: TarotPickCanvasProps) {
  return (
    <section className={styles.tarotCanvas} aria-label="최종 계시 카드 선택">
      <header className={styles.tarotHeader}>
        <h3>{title ?? "✦ 最終 啓示 · 최종 계시"}</h3>
        {description ? (
          <p>{description}</p>
        ) : (
          <p>
            꽃 아래에 놓인 세 장의 카드 중 하나를 선택하면,<br />
            카드가 뒤집히며 오늘의 최종 조언이 열립니다.
          </p>
        )}
      </header>

      <div className={styles.tarotDeck}>
        {cards.map((card, index) => {
          const isSelected = selectedCardId === card.id;
          const isLocked = lockAfterPick && !!selectedCardId && !isSelected;

          return (
            <button
              type="button"
              key={card.id}
              className={`${styles.tarotCard} ${isSelected ? styles.tarotCardSelected : ""} ${isLocked ? styles.tarotCardLocked : ""}`}
              onClick={() => !isLocked && onPick(card.id)}
              disabled={isLocked}
              style={{ animationDelay: `${index * 180}ms` }}
              aria-label={isSelected ? `${card.name} — 계시됨` : "카드를 선택하세요"}
            >
              <span className={styles.tarotCardInner}>
                {/* Card back */}
                <span className={styles.tarotCardBack}>
                  <span className={styles.tarotBackSymbol}>✦</span>
                  <span className={styles.tarotBackText}>Destiny Bloom</span>
                </span>
                {/* Card front */}
                <span className={styles.tarotCardFront}>
                  <span className={styles.tarotArtFrame}>
                    <img
                      src={getTarotCardImage(card.id, card.name)}
                      alt={card.name}
                      className={styles.tarotCardArt}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <b className={styles.tarotArcana}>#{card.arcanaNo}</b>
                  <strong className={styles.tarotName}>{card.name}</strong>
                  <em className={styles.tarotSubtitle}>{card.subtitle}</em>
                  {isSelected && (
                    <span className={styles.tarotReveal}>{card.reveal}</span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
});
