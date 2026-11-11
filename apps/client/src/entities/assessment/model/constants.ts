import type { AssessmentMeta } from "./types";

// 검사 이름·능력·설명 문구는 번역 리소스(assessment.types.<type>)에 있다.

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    type: "cat-chase",
    image: "/assessment/cat-chase.png",
    tone: "yellow",
    playable: true,
  },
  {
    type: "road-making",
    image: "/assessment/road-making.png",
    tone: "orange",
    playable: true,
  },
];

export const MIN_QUESTION_COUNT = 3;
export const MAX_QUESTION_COUNT = 10;
export const DEFAULT_QUESTION_COUNT = 5;

export const QUESTION_COUNTS = Array.from(
  { length: MAX_QUESTION_COUNT - MIN_QUESTION_COUNT + 1 },
  (_, i) => MIN_QUESTION_COUNT + i,
);

// 끝까지 풀고 1문항 이상 맞히면 기본 20코인 + 맞힌 문항마다 10코인 (서버 AssessmentReward 기준)
export const BASE_REWARD_COIN = 20;
export const REWARD_PER_CORRECT = 10;

export const getMaxReward = (questionCount: number) =>
  BASE_REWARD_COIN + REWARD_PER_CORRECT * questionCount;

// GitHub 연동 이후 새로 생긴 커밋 1개당 코인 (서버 CoinSyncService 기준)
export const COIN_PER_COMMIT = 10;

// 중간에 이탈하거나 모두 틀리면 0코인
export const getReward = (completed: boolean, correctCount: number) =>
  !completed || correctCount <= 0
    ? 0
    : BASE_REWARD_COIN + REWARD_PER_CORRECT * correctCount;
