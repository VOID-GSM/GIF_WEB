export interface GetRankParams {
  grade: 1 | 2;
}

export interface ScoreRankResponse {
  projectId?: number;
  rank: number;
  name: string;
  teamName: string;
  totalScore: number;
  logo?: string | null;
  projectLogo?: string | null;
  teamLogo?: string | null;
  thumbnailUrl?: string | null;
}

export interface RankItem {
  rank: number;
  name: string;
  teamName: string;
  logo?: string | null;
}

export interface RankProjectResponse {
  id: number;
  name: string;
  teamName: string;
  logo?: string | null;
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
