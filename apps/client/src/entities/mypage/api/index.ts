import { apiClient } from "@repo/lib";

import type {
  PatchMyInfoResponse,
  UpdateClientInfoRequest,
} from "@/entities/mypage/model/type";

export const updateClientInfo = (body: UpdateClientInfoRequest) =>
  apiClient.patch<PatchMyInfoResponse>("/api/auth/me", body);
