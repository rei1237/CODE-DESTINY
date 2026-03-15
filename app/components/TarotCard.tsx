"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type TarotCardProps = {
  frontImageUrl?: string;
  frontTitle?: string;
  frontSubtitle?: string;
  className?: string;
  initiallyFlipped?: boolean;
};

export default function TarotCard({
  frontImageUrl,
  frontTitle = "The Star",
  frontSubtitle = "Healing & Rising",
  className = "",
  initiallyFlipped = false,
}: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(initiallyFlipped);

  return (
    <div className={`w-[220px] h-[340px] perspective-[1000px] ${className}`}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "타로 카드 앞면" : "타로 카드 뒷면"}
        onClick={() => setIsFlipped((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped((v) => !v);
          }
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          y: isFlipped ? -6 : 0,
          scale: isFlipped ? 1.02 : 1,
          boxShadow: isFlipped
            ? "0 28px 48px rgba(124, 58, 237, 0.35), 0 10px 24px rgba(0,0,0,0.22)"
            : "0 16px 30px rgba(0,0,0,0.18)",
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 20,
          mass: 0.8,
        }}
        whileHover={{
          y: -4,
          scale: 1.015,
          boxShadow: "0 22px 40px rgba(124, 58, 237, 0.28)",
        }}
        className="relative h-full w-full rounded-2xl cursor-pointer [transform-style:preserve-3d]"
      >
        {/* Back Face */}
        <div className="absolute inset-0 rounded-2xl border border-violet-200/40 bg-gradient-to-br from-violet-900 via-purple-700 to-fuchsia-500 [backface-visibility:hidden] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="absolute inset-3 rounded-xl border border-yellow-200/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl drop-shadow-[0_0_14px_rgba(251,191,36,0.75)]">✦</div>
          </div>
          <div className="absolute bottom-5 w-full text-center text-amber-100/90 font-semibold tracking-wide">
            Healing Tarot
          </div>
        </div>

        {/* Front Face */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-amber-100/60 bg-gradient-to-br from-rose-100 via-amber-50 to-fuchsia-100 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {frontImageUrl ? (
            <img
              src={frontImageUrl}
              alt={frontTitle}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,191,36,0.32),transparent_45%),linear-gradient(145deg,#f5d0fe_0%,#fde68a_50%,#fed7aa_100%)]" />
          )}

          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/74 backdrop-blur-sm px-3 py-2 text-center shadow-sm">
            <div className="text-sm font-bold text-violet-900">{frontTitle}</div>
            <div className="text-xs text-violet-700">{frontSubtitle}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

