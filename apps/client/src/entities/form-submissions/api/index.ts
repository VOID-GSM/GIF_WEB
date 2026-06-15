import { apiClient } from "@repo/lib";

import type {
  DeleteFormUploadParams,
  GetFormMySubmitParams,
  GetFormMySubmitResponse,
  PatchFormSubmitRequest,
  PatchFormUpdateRequest,
  PostFormSubmitRequest,
  PostFormUploadResponse,
} from "../model/types";

export const postFormSubmit = (body: PostFormSubmitRequest) =>
  apiClient.post("/api/form/submit", body);

export const postFormUpload = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<PostFormUploadResponse>("/api/form/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteFormUpload = (params: DeleteFormUploadParams) =>
  apiClient.delete("/api/form/upload", { params });

export const patchFormSubmit = (body: PatchFormSubmitRequest) =>
  apiClient.patch("/api/form/submit", body);

export const patchFormUpdate = (body: PatchFormUpdateRequest) =>
  apiClient.patch("/api/form/update", body);

export const getFormMySubmit = (params: GetFormMySubmitParams) =>
  apiClient.get<GetFormMySubmitResponse>("/api/form/my-submit", { params });
