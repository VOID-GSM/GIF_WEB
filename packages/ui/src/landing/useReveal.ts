"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOptions {
  /** 요소가 얼마나 보이면 등장시킬지 (0~1) */
  threshold?: number;
  /** 뷰포트 기준 여유 마진 */
  rootMargin?: string;
  /** true면 한 번 등장 후 다시 숨기지 않음 */
  once?: boolean;
}

/**
 * IntersectionObserver로 요소가 뷰포트에 들어왔는지 추적한다.
 * prefers-reduced-motion 사용자에게는 애니메이션 없이 바로 노출한다.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    once = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 모션 최소화 설정을 존중해 즉시 노출한다.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
