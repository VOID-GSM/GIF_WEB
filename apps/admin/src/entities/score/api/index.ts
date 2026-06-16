import { apiClient } from "@repo/lib";
import type {
  DetailScoreResponse,
  CreateMajorScoreRequest,
  CreateReportScoreRequest,
  CreateSocialScoreRequest,
} from "../model/types";

export const getMajorScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/major", { params: { projectId } });

export const postMajorScore = (body: CreateMajorScoreRequest) =>
  apiClient.post<void>("/api/score/major", body);

export const patchMajorScore = (body: CreateMajorScoreRequest) =>
  apiClient.patch<void>("/api/score/major", body);

export const getReportScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/report", { params: { projectId } });

export const postReportScore = (body: CreateReportScoreRequest) =>
  apiClient.post<void>("/api/score/report", body);

export const patchReportScore = (body: CreateReportScoreRequest) =>
  apiClient.patch<void>("/api/score/report", body);

export const getSocialScore = (projectId: number) =>
  apiClient.get<DetailScoreResponse>("/api/score/social", { params: { projectId } });

export const postSocialScore = (body: CreateSocialScoreRequest) =>
  apiClient.post<void>("/api/score/social", body);

export const patchSocialScore = (body: CreateSocialScoreRequest) =>
  apiClient.patch<void>("/api/score/social", body);

export const postScoreNotice = () =>
  apiClient.post<void>("/api/score/notice");
