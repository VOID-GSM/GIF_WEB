export type AssessmentType = "cat-chase" | "road-making";

export interface AssessmentMeta {
  type: AssessmentType;
  title: string;
  ability: string;
  description: string;
  image: string;
  tone: "yellow" | "orange";
}

// 랭킹 API 가 준비되면 이 형태로 받아 RankingCard 에 그대로 넘긴다.
export interface AssessmentRankingEntry {
  rank: number;
  name: string;
  grade: number | null;
  correctCount: number;
  totalCount: number;
  coin: number;
  isMe?: boolean;
}
