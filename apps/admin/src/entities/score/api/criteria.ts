import { apiClient } from "@repo/lib";
import type {
  ScoreCriteriaArea,
  ScoreCriteriaItem,
  CreateScoreCriteriaAreaRequest,
  PatchScoreCriteriaAreaRequest,
  CreateScoreCriteriaItemRequest,
  PatchScoreCriteriaItemRequest,
  ProjectItemScoreResponse,
  SaveItemScoresRequest,
} from "../model/types";

// 평가 기준(영역·항목) — 조회는 선생님 전체, 생성·수정·삭제는 MASTER
export const getScoreCriteriaAreas = () =>
  apiClient.get<ScoreCriteriaArea[]>("/api/score/areas");

export const postScoreCriteriaArea = (body: CreateScoreCriteriaAreaRequest) =>
  apiClient.post<ScoreCriteriaArea>("/api/score/areas", body);

export const patchScoreCriteriaArea = (areaId: number, body: PatchScoreCriteriaAreaRequest) =>
  apiClient.patch<ScoreCriteriaArea>(`/api/score/areas/${areaId}`, body);

export const deleteScoreCriteriaArea = (areaId: number) =>
  apiClient.delete<void>(`/api/score/areas/${areaId}`);

export const postScoreCriteriaItem = (areaId: number, body: CreateScoreCriteriaItemRequest) =>
  apiClient.post<ScoreCriteriaItem>(`/api/score/areas/${areaId}/items`, body);

export const patchScoreCriteriaItem = (
  areaId: number,
  itemId: number,
  body: PatchScoreCriteriaItemRequest,
) => apiClient.patch<ScoreCriteriaItem>(`/api/score/areas/${areaId}/items/${itemId}`, body);

export const deleteScoreCriteriaItem = (areaId: number, itemId: number) =>
  apiClient.delete<void>(`/api/score/areas/${areaId}/items/${itemId}`);

// 항목 기반 채점 — 로그인한 선생님 본인의 점수 (VOID 계정 불가)
export const getProjectItemScores = (projectId: number) =>
  apiClient.get<ProjectItemScoreResponse>(`/api/score/projects/${projectId}/items`);

export const putProjectItemScores = (projectId: number, body: SaveItemScoresRequest) =>
  apiClient.put<ProjectItemScoreResponse>(`/api/score/projects/${projectId}/items`, body);
