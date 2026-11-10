import type { CatChaseConfidence, CatChaseJudgment } from "./types";

// 서버 보드는 6x6 고정이다 (CatChaseRound.GRID_SIZE = 36).
export const DEFAULT_CAT_CHASE_BOARD_SIDE = 6;

// 서버의 gridSize 는 전체 칸 수(6x6 → 36)라서 화면에서 쓰는 한 변의 칸 수로 바꾼다.
export const toBoardSide = (gridSize: number | undefined) => {
  const side = Math.sqrt(gridSize ?? 0);
  return Number.isInteger(side) && side > 0
    ? side
    : DEFAULT_CAT_CHASE_BOARD_SIDE;
};

// 단계별 노출 시간(ms). answer 는 고양이 1마리 질문마다 주는 응답 제한 시간이다.
export const CAT_CHASE_TIMING = {
  mice: 3000,
  blank: 800,
  cats: 2000,
  answer: 10000,
} as const;

// 한 문항에서 판단하는 고양이: 서버가 준 catPositions 순서대로 빨강, 파랑 (GIF_SERVER#240)
export const CAT_COLORS = ["red", "blue"] as const;
export type CatColor = (typeof CAT_COLORS)[number];

export const CAT_COLOR_LABELS: Record<CatColor, string> = {
  red: "빨간 고양이",
  blue: "파란 고양이",
};

// catPositions 의 순서로 고양이 색을 정한다. 색이 없는 고양이(예전 기록)는 null
export const getCatColor = (index: number): CatColor | null =>
  CAT_COLORS[index] ?? null;

export const JUDGMENT_LABELS: Record<CatChaseJudgment, string> = {
  FOUND: "잡다 (O)",
  MISSED: "놓치다 (X)",
  TIMEOUT: "시간 초과",
};

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
