"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "./useReveal";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  /** 등장 방향 */
  direction?: Direction;
  /** 등장 지연(ms) — 리스트 스태거 효과에 사용 */
  delay?: number;
  className?: string;
}

const OFFSET: Record<Direction, string> = {
  up: "translateY(40px)",
  down: "translateY(-40px)",
  left: "translateX(40px)",
  right: "translateX(-40px)",
  none: "none",
};

/**
 * 자식 요소를 감싸 스크롤 시 fade + slide-in으로 등장시키는 래퍼.
 * 별도 애니메이션 라이브러리 없이 IntersectionObserver + CSS transition만 사용한다.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "none" : OFFSET[direction],
    transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
