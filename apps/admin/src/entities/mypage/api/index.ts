import { apiClient } from "@repo/lib";
import type { UpdateAdminInfoRequest } from "@/entities/mypage/model/type";

export const updateAdminInfo = (body: UpdateAdminInfoRequest) =>
  apiClient.patch("/api/additional-info/admin", body);
