import type { CatChaseQuestion } from "@/entities/assessment";

export type CatChaseJudgment = "FOUND" | "MISSED";

export type CatChaseConfidence =
  | "VERY_CONFIDENT"
  | "CONFIDENT"
  | "SOMEWHAT_UNSURE"
  | "UNSURE";

export interface CatChaseJudgmentItem {
  position: number;
  judgment: CatChaseJudgment;
  confidence: CatChaseConfidence;
}

// POST /rounds/{roundId}/questions/{questionId}/judgments
// 문항에 나온 고양이마다 정확히 한 번씩 판단해야 한다.
export interface SubmitCatChaseJudgmentsRequest {
  judgments: CatChaseJudgmentItem[];
}

// 라운드 결과 (마지막 문항 제출 응답, finish 응답)
export interface CatChaseRoundResult {
  roundId: number;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  // 끝까지 풀었는지. 중간에 그만두면 false 이고 코인을 받지 않는다.
  completed: boolean;
  earnedCoin: number;
}

export interface SubmitCatChaseJudgmentsResponse {
  correct: boolean;
  answeredCount: number;
  correctCount: number;
  // 남은 문항이 있으면 다음 문항, 마지막 문항이었으면 null
  nextQuestion: CatChaseQuestion | null;
  // 마지막 문항이었으면 라운드 결과, 아니면 null
  result: CatChaseRoundResult | null;
}

// GET /rounds
export interface CatChaseRoundSummary {
  roundId: number;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  // 끝났는지(완료 또는 중단). false 면 아직 진행 중이다.
  finished: boolean;
  completed: boolean;
  earnedCoin: number;
  createdAt: string;
}

export interface CatChaseJudgmentResult extends CatChaseJudgmentItem {
  hadMouse: boolean;
  correct: boolean;
}

export interface CatChaseQuestionResult extends CatChaseQuestion {
  answered: boolean;
  // 고양이 판단을 모두 맞혀야 정답이다.
  correct: boolean;
  responses: CatChaseJudgmentResult[];
}

// GET /rounds/{roundId}
export interface CatChaseRoundDetail {
  roundId: number;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  completed: boolean;
  earnedCoin: number;
  questions: CatChaseQuestionResult[];
  createdAt: string;
  // 진행 중이면 null
  finishedAt: string | null;
}

// 검사 화면이 진행에 쓰는 라운드 상태
export interface CatChaseSession {
  roundId: number;
  // 보드 한 변의 칸 수
  boardSide: number;
  questionCount: number;
  // 지금 풀 문항. 라운드가 끝났으면 null
  question: CatChaseQuestion | null;
  // 라운드가 끝났으면 결과, 진행 중이면 null
  result: CatChaseRoundResult | null;
}
