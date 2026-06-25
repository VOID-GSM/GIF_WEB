import { apiClient } from "@repo/lib";
import type {
  PostFormRequest,
  PostFormResponse,
  PostFormAnnounceParams,
} from "../model/type";

export const postForm = (body: PostFormRequest) =>
  apiClient.post<PostFormResponse>("/api/form", body);

export const announceForm = (params: PostFormAnnounceParams) =>
  apiClient.post("/api/form/announce", null, { params });
