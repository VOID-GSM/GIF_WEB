import type { CatChaseConfidence } from "./types";

// 서버 보드는 6x6 고정이다 (CatChaseRound.GRID_SIZE = 36).
export const DEFAULT_CAT_CHASE_BOARD_SIDE = 6;

// 서버의 gridSize 는 전체 칸 수(6x6 → 36)라서 화면에서 쓰는 한 변의 칸 수로 바꾼다.
export const toBoardSide = (gridSize: number | undefined) => {
  const side = Math.sqrt(gridSize ?? 0);
  return Number.isInteger(side) && side > 0
    ? side
    : DEFAULT_CAT_CHASE_BOARD_SIDE;
};

// 단계별 노출 시간(ms)
export const CAT_CHASE_TIMING = {
  mice: 3000,
  blank: 800,
  cats: 2000,
  target: 1500,
} as const;

export const CONFIDENCE_OPTIONS: { value: CatChaseConfidence; label: string }[] =
  [
    { value: "VERY_CONFIDENT", label: "매우 확신" },
    { value: "CONFIDENT", label: "확신" },
    { value: "SOMEWHAT_UNSURE", label: "조금 헷갈림" },
    { value: "UNSURE", label: "모르겠음" },
  ];

export const CONFIDENCE_LABELS = Object.fromEntries(
  CONFIDENCE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<CatChaseConfidence, string>;
