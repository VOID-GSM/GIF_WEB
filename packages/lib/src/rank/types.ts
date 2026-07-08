export interface GetRankParams {
  grade: 1 | 2;
}

export interface ScoreRankResponse {
  rank: number;
  teamName: string;
  totalScore: number;
}

export interface RankItem {
  rank: number;
  teamName: string;
}

export interface ScoreNoticeItem {
  projectId: number;
  teamName: string;
  averageScore: number;
  scoreCount: number;
}

export interface ScoreNoticeResponse {
  isPublished: boolean;
  publishedAt: string | null;
  scores: ScoreNoticeItem[];
}
