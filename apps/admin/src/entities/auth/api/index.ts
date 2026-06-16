import { apiClient } from "@repo/lib";

import type {
  GetMyInfoResponse,
  GetGoogleCallbackParams,
  GetGoogleCallbackResponse,
} from "../model/types";

export const getMyInfo = () => apiClient.get<GetMyInfoResponse>("/api/auth/me");

export const getGoogleCallback = (params: GetGoogleCallbackParams) =>
  apiClient.get<GetGoogleCallbackResponse>("/api/auth/google/callback", {
    params,
  });
