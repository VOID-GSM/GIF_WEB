import { apiClient } from "@repo/lib";

import type {
  GetDgCallbackParams,
  GetDgCallbackResponse,
  GetMyInfoResponse,
} from "../model/types";

export const getMyInfo = () => apiClient.get<GetMyInfoResponse>("/api/users/me");

// DataGSM 로그인 콜백 — 서버가 선생님(TEACHER) 계정은 ADMIN, 학생 계정은 USER로 매핑한다.
export const getDgCallback = (params: GetDgCallbackParams) =>
  apiClient.get<GetDgCallbackResponse>("/api/auth/dg/callback", { params });
