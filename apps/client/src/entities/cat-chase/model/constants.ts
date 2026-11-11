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

// 단계별 노출 시간(ms). answer 는 고양이 1마리 질문마다 주는 응답 제한 시간이다.
export const CAT_CHASE_TIMING = {
  mice: 3000,
  blank: 800,
  cats: 2000,
  answer: 10000,
} as const;

// 확신도 라벨은 번역 리소스(catChase.confidence.<값>)에 있다.
export const CONFIDENCE_VALUES: CatChaseConfidence[] = [
  "VERY_CONFIDENT",
  "CONFIDENT",
  "SOMEWHAT_UNSURE",
  "UNSURE",
];

// 한 문항에서 판단하는 고양이: 서버가 준 catPositions 순서대로 빨강, 파랑 (GIF_SERVER#240)
// 색 라벨은 번역 리소스(catChase.catColor.<색>)에 있다.
export const CAT_COLORS = ["red", "blue"] as const;
export type CatColor = (typeof CAT_COLORS)[number];

// catPositions 의 순서로 고양이 색을 정한다. 색이 없는 고양이(예전 기록)는 null
export const getCatColor = (
  index: number,
  catCount: number,
): CatColor | null =>
  catCount === CAT_COLORS.length ? (CAT_COLORS[index] ?? null) : null;
