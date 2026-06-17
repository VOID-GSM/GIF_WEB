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
