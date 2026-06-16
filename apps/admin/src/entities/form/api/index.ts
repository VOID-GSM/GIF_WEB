import { apiClient } from "@repo/lib";

import type { GetFormListResponse, UpdateFormRequest } from "../model/types";

export const getFormList = () =>
  apiClient.get<GetFormListResponse>("/api/form/admin");

export const deleteForm = (formId: number) =>
  apiClient.delete("/api/form/delete", { params: { formId } });

export const announceForm = (formId: number) =>
  apiClient.post("/api/form/announce", null, { params: { formId } });

export const updateForm = (formId: number, body: UpdateFormRequest) =>
  apiClient.patch("/api/form/update", body, { params: { formId } });
