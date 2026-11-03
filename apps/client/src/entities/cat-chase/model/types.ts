export type CatChaseJudgment = "FOUND" | "MISSED";

export type CatChaseConfidence =
  | "VERY_CONFIDENT"
  | "CONFIDENT"
  | "SOMEWHAT_UNSURE"
  | "UNSURE";

export interface StartCatChaseRoundResponse {
  roundId: number;
  // 화면에서 쓰는 한 변의 칸 수 (서버 원본은 전체 칸 수)
  gridSize: number;
  mousePositions: number[];
  catPositions: number[];
}

export interface CatChaseJudgmentItem {
  position: number;
  judgment: CatChaseJudgment;
  confidence: CatChaseConfidence;
}

export interface SubmitCatChaseJudgmentsRequest {
  judgments: CatChaseJudgmentItem[];
}

export interface CatChaseRoundSummary {
  roundId: number;
  mouseCount: number;
  catCount: number;
  answered: boolean;
  createdAt: string;
}

export interface CatChaseJudgmentResult extends CatChaseJudgmentItem {
  hadMouse: boolean;
}

export interface CatChaseRoundDetail {
  roundId: number;
  mousePositions: number[];
  catPositions: number[];
  responses: CatChaseJudgmentResult[];
  createdAt: string;
}
