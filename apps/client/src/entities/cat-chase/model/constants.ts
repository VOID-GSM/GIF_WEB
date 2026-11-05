import type {
  CatChaseConfidence,
  CatChaseJudgmentResult,
  CatChaseRoundDetail,
} from "./types";

// 상세 조회 응답에는 gridSize 가 없어서, 라운드 시작 응답의 기본값(6x6)을 기준으로 그린다.
export const DEFAULT_CAT_CHASE_GRID_SIZE = 6;

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

export const isCorrectJudgment = (result: CatChaseJudgmentResult) =>
  (result.judgment === "FOUND") === result.hadMouse;

// 한 라운드(문항)는 모든 고양이 판단을 맞혀야 정답으로 본다.
export const isRoundCorrect = (detail: CatChaseRoundDetail) =>
  detail.responses.length > 0 && detail.responses.every(isCorrectJudgment);

// 위치 값이 기본 격자를 벗어나면 그만큼 격자를 키워서 그린다.
export const inferGridSize = (positions: number[]) => {
  const maxPosition = Math.max(-1, ...positions);
  return Math.max(
    DEFAULT_CAT_CHASE_GRID_SIZE,
    Math.ceil(Math.sqrt(maxPosition + 1)),
  );
};

// 문항 수는 3~10개, 진입 화면에서 넘어오지 않으면 5개로 진행한다.
export const MIN_QUESTION_COUNT = 3;
export const MAX_QUESTION_COUNT = 10;
export const DEFAULT_QUESTION_COUNT = 5;

// 끝까지 풀면 기본 20코인, 맞힌 문항마다 10코인 추가
export const BASE_REWARD_COIN = 20;
export const REWARD_PER_CORRECT = 10;
