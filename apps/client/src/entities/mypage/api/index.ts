import { apiClient } from "@repo/lib";
import type { UpdateClientInfoRequest } from "@/entities/mypage/model/type";

export const updateClientInfo = (body: UpdateClientInfoRequest) =>
  apiClient.patch("/api/additional-info/client", body);
