export interface GetRankParams {
  grade: 1 | 2;
}

export interface ListProjectResponse {
  id: number;
  name: string;
  teamName: string;
  logoPath: string;
}

export interface DetailScoreResponse {
  id: number;
  subTotalScore: number;
  rank: number;
}

export interface RankItem {
  rank: number;
  teamName: string;
}
