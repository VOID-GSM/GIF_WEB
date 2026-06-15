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
