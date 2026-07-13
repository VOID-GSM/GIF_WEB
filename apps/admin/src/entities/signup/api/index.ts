import { apiClient } from "@repo/lib";

import type {
  PostAdminInfoRequest,
  PostAdminInfoResponse,
} from "../model/types";

export const postAdminInfo = (body: PostAdminInfoRequest) =>
  apiClient.post<PostAdminInfoResponse>("/api/additional-info/admin", body);
