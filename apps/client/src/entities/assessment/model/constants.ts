import type { AssessmentMeta } from "./types";

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    type: "cat-chase",
    title: "고양이 술래잡기",
    ability: "작업 기억",
    description: "쥐가 숨은 자리를 기억하고 찾아내요",
    image: "/assessment/cat-chase.png",
    tone: "yellow",
  },
  {
    type: "road-making",
    title: "길 만들기",
    ability: "공간 지각",
    description: "울타리를 세워 차가 목적지에 닿게 해요",
    image: "/assessment/road-making.png",
    tone: "orange",
  },
];

export const MIN_QUESTION_COUNT = 3;
export const MAX_QUESTION_COUNT = 10;
export const DEFAULT_QUESTION_COUNT = 5;

export const QUESTION_COUNTS = Array.from(
  { length: MAX_QUESTION_COUNT - MIN_QUESTION_COUNT + 1 },
  (_, i) => MIN_QUESTION_COUNT + i,
);

// 끝까지 풀면 기본 20코인, 맞힌 문항마다 10코인 추가
export const BASE_REWARD_COIN = 20;
export const REWARD_PER_CORRECT = 10;

export const getMaxReward = (questionCount: number) =>
  BASE_REWARD_COIN + REWARD_PER_CORRECT * questionCount;
