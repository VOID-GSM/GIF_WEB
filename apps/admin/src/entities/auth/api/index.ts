import { apiClient } from "@repo/lib";

import type {
  GetGoogleCallbackParams,
  GetGoogleCallbackResponse,
} from "../model/types";

export const getGoogleCallback = (params: GetGoogleCallbackParams) =>
  apiClient.get<GetGoogleCallbackResponse>("/api/auth/google/callback", {
    params,
  });
