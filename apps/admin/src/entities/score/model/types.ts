export interface DetailScoreResponse {
  id: number;
  evaluatorId: string;
  technicalCompleteness: number;
  socialValueMajor: number;
  aiUtilizationMajor: number;
  presentationMajor: number;
  reportWriting: number;
  reportContent: number;
  aiUsagePlan: number;
  creativity: number;
  userExperience: number;
  socialValueCommunity: number;
  aiUtilizationCommunity: number;
  presentationCommunity: number;
  subTotalScore: number;
  rank: number;
}

export interface CreateMajorScoreRequest {
  projectId: number;
  technicalCompleteness: number;
  socialValueMajor: number;
  aiUtilityMajorScore: number;
  presentationMajor: number;
}

export interface CreateReportScoreRequest {
  projectId: number;
  reportWriting: number;
  reportContent: number;
  aiUsagePlan: number;
  creativity: number;
}

export interface CreateSocialScoreRequest {
  projectId: number;
  userExperience: number;
  socialValueCommunity: number;
  aiUtilizationCommunity: number;
  presentationCommunity: number;
}

export type PatchMajorScoreRequest = Omit<CreateMajorScoreRequest, "projectId">;

export type PatchReportScoreRequest = Omit<CreateReportScoreRequest, "projectId">;

export type PatchSocialScoreRequest = Omit<CreateSocialScoreRequest, "projectId">;

export interface GetScoreSummaryResponse {
  projectId: number;
  teamName: string;
  averageScore: number;
  scoreCount: number;
}

export interface GetScoreNoticeResponse {
  isPublished: boolean;
  publishedAt: string;
  scores: GetScoreSummaryResponse[];
}

export interface GetProjectFieldAverageResponse {
  projectId: number;
  majorAverage: number;
  reportAverage: number;
  communityAverage: number;
  grandTotalAverage: number;
}

export type ScorePeriodCategory = "MAJOR" | "REPORT" | "SOCIAL";

export interface PostScorePeriodRequest {
  category: ScorePeriodCategory;
  startDate: string; // ISO 8601
}

// ── 평가 기준(영역·항목) ─────────────────────────────────────────
// 기존 ScoreArea("major" | "report" | "social")와 이름이 겹치지 않도록 Criteria 접두어를 쓴다.

export interface ScoreCriteriaItem {
  id: number;
  areaId: number;
  name: string;
  criteria: string | null;
  maxScore: number;
  /** 선택지 점수 (높은 점수 순) */
  options: number[];
  displayOrder: number;
}

export interface ScoreCriteriaArea {
  id: number;
  name: string;
  displayOrder: number;
  totalMaxScore: number;
  items: ScoreCriteriaItem[];
}

export interface CreateScoreCriteriaAreaRequest {
  name: string;
  displayOrder?: number;
}

export type PatchScoreCriteriaAreaRequest = Partial<CreateScoreCriteriaAreaRequest>;

export interface CreateScoreCriteriaItemRequest {
  name: string;
  criteria?: string;
  options: number[];
  displayOrder?: number;
}

export type PatchScoreCriteriaItemRequest = Partial<CreateScoreCriteriaItemRequest>;

// ── 항목 기반 채점 ───────────────────────────────────────────────

export interface ProjectItemScore {
  id: number;
  name: string;
  criteria: string | null;
  maxScore: number;
  options: number[];
  /** 내가 준 점수. 미채점이면 null */
  score: number | null;
}

export interface ProjectAreaScore {
  id: number;
  name: string;
  totalScore: number;
  totalMaxScore: number;
  items: ProjectItemScore[];
}

export interface ProjectItemScoreResponse {
  projectId: number;
  totalScore: number;
  totalMaxScore: number;
  areas: ProjectAreaScore[];
}

export interface SaveItemScoresRequest {
  scores: { itemId: number; score: number }[];
}
