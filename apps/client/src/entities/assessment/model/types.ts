export type AssessmentType = "cat-chase" | "road-making";

export interface AssessmentMeta {
  type: AssessmentType;
  title: string;
  ability: string;
  description: string;
  image: string;
  tone: "yellow" | "orange";
  // 검사 진행 페이지(/assessment/[type])가 준비됐는지
  playable: boolean;
}

// GET /api/assessment/{type}/ranking
// 서버가 동점을 정답률·소요 시간·달성 시각으로 다시 비교해 1부터 차례로 매기므로 rank는 겹치지 않는다.
export interface AssessmentRankingEntry {
  rank: number;
  name: string;
  grade: number | null;
  correctCount: number;
  totalCount: number;
  earnedCoin: number;
}

export interface AssessmentRankingResponse {
  questionCount: number;
  rankings: AssessmentRankingEntry[];
  // 내 기록이 없으면 null
  me: AssessmentRankingEntry | null;
}

export interface AssessmentRankingParams {
  questionCount: number;
  limit?: number;
}

// POST /api/assessment/{type}/rounds
export interface StartAssessmentRoundRequest {
  questionCount: number;
}

export interface CatChaseQuestion {
  questionId: number;
  sequence: number;
  mousePositions: number[];
  catPositions: number[];
}

export interface StartCatChaseRoundResponse {
  roundId: number;
  gridSize: number;
  questionCount: number;
  question: CatChaseQuestion;
}

export interface RoadMakingProblem {
  problemId: number;
  sequence: number;
  rows: number;
  cols: number;
  minFenceCount: number;
  vehicles: unknown[];
  people: unknown[];
}

export interface StartRoadMakingRoundResponse {
  roundId: number;
  questionCount: number;
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
  problem: RoadMakingProblem;
}

export interface StartRoundResponseMap {
  "cat-chase": StartCatChaseRoundResponse;
  "road-making": StartRoadMakingRoundResponse;
}
