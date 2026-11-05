import type { AssessmentMeta } from "./types";

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    type: "cat-chase",
    title: "고양이 술래잡기",
    ability: "작업 기억",
    description: "쥐가 숨은 자리를 기억하고 찾아내요",
    image: "/assessment/cat-chase.png",
    tone: "yellow",
    playable: false,
  },
  {
    type: "road-making",
    title: "길 만들기",
    ability: "공간 지각",
    description: "울타리를 세워 차가 목적지에 닿게 해요",
    image: "/assessment/road-making.png",
    tone: "orange",
    playable: false,
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
