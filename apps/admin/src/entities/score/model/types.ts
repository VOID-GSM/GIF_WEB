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
