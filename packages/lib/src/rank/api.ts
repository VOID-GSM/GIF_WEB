import { apiClient } from "../axios";
import type { DetailScoreResponse, ListProjectResponse } from "./types";

export const getProjectsByGrade = (grade: 1 | 2) =>
  apiClient.get<ListProjectResponse[]>("/api/project/filter", {
    params: { grade },
  });

export const getSocialScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/social", {
    params: { projectId },
  });

export const getReportScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/report", {
    params: { projectId },
  });

export const getMajorScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/major", {
    params: { projectId },
  });
