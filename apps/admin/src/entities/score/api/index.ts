import { apiClient } from "@repo/lib";
import type { DetailScoreResponse } from "../model/types";

export const getSocialScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/social", { params: { projectId } });

export const getReportScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/report", { params: { projectId } });

export const getMajorScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/major", { params: { projectId } });
