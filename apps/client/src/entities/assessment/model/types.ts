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

// ---- 길 만들기 (서버 domain/assessment/roadmaking 기준) ----

export type RoadMakingColor =
  "RED" | "BLUE" | "GREEN" | "YELLOW" | "PURPLE" | "ORANGE";

export type RoadMakingDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

export interface BoardPosition {
  row: number;
  col: number;
}

// 차는 direction 으로 직진하다 울타리를 만나면 시계 방향으로 돈다.
export interface RoadMakingVehicle {
  color: RoadMakingColor;
  position: BoardPosition;
  direction: RoadMakingDirection;
}

// 차가 처음 닿는 사람에서 멈추며, 색이 같아야 도착으로 인정된다.
export interface RoadMakingPerson {
  color: RoadMakingColor;
  position: BoardPosition;
}

export interface RoadMakingProblem {
  problemId: number;
  sequence: number;
  rows: number;
  cols: number;
  // 제출할 울타리 개수 (서버가 정확히 이 개수만 받는다)
  minFenceCount: number;
  vehicles: RoadMakingVehicle[];
  people: RoadMakingPerson[];
}

// 문항마다 한 번만 답하고, questionCount 개를 다 답하거나 제한 시간(5분)이 끝나면 라운드가 끝난다.
export interface StartRoadMakingRoundResponse {
  roundId: number;
  questionCount: number;
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
  problem: RoadMakingProblem;
}

// POST /api/assessment/road-making/rounds/{roundId}/problems/{problemId}/submit
export interface SubmitRoadMakingAnswerRequest {
  fences: BoardPosition[];
}

export interface RoadMakingVehicleResult {
  color: RoadMakingColor;
  // 출발 칸부터 멈춘 칸까지
  path: BoardPosition[];
  reached: boolean;
}

// POST /api/assessment/road-making/rounds/{roundId}/finish
// 끝까지 풀기 전에 직접 종료하면 이탈(completed=false)로 처리되어 코인이 0 이다.
export interface RoadMakingRoundResult {
  roundId: number;
  questionCount: number;
  solvedCount: number;
  wrongCount: number;
  accuracy: number;
  elapsedSeconds: number;
  completed: boolean;
  earnedCoin: number;
}

export interface SubmitRoadMakingAnswerResponse {
  correct: boolean;
  timeOver: boolean;
  solvedCount: number;
  wrongCount: number;
  vehicleResults: RoadMakingVehicleResult[];
  // 맞히든 틀리든 다음 문제가 온다. 마지막 문항이면 null
  nextProblem: RoadMakingProblem | null;
  // 마지막 문항에 답했거나 시간이 끝났을 때만 결과가 온다
  result: RoadMakingRoundResult | null;
}

export interface StartRoundResponseMap {
  "cat-chase": StartCatChaseRoundResponse;
  "road-making": StartRoadMakingRoundResponse;
}
