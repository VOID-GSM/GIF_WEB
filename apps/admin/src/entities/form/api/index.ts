import { apiClient } from "@repo/lib";

import type {
  GetFormsResponse,
  GetFormListResponse,
  UpdateFormRequest,
} from "../model/types";

// 프로젝트별 양식(제출) 현황 — project-detail
export const getForms = (projectId: number) =>
  apiClient.get<GetFormsResponse>("/api/form", {
    params: { projectId },
  });

// 양식 관리 — 목록/삭제/공지/수정
export const getFormList = () =>
  apiClient.get<GetFormListResponse>("/api/form/admin");

export const deleteForm = (formId: number) =>
  apiClient.delete(`/api/form/${formId}`);

export const announceForm = (formId: number) =>
  apiClient.post("/api/form/announce", null, { params: { formId } });

export const updateForm = (formId: number, body: UpdateFormRequest) =>
  apiClient.patch("/api/form/update", body, { params: { formId } });
