import { apiClient } from "@repo/lib";

import type {
  PatchMyInfoResponse,
  UpdateAdminInfoRequest,
} from "@/entities/mypage/model/type";

export const updateAdminInfo = (body: UpdateAdminInfoRequest) =>
  apiClient.patch<PatchMyInfoResponse>("/api/auth/me", body);
