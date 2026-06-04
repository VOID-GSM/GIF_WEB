import { apiClient } from "@repo/lib";

import type {
  GetDgCallbackParams,
  GetDgCallbackResponse,
  PostSignInRequest,
  PostSignInResponse,
} from "../model/types";

export const postSignIn = (body: PostSignInRequest) =>
  apiClient.post<PostSignInResponse>("/api/auth/signin", body);

export const getDgCallback = (params: GetDgCallbackParams) =>
  apiClient.get<GetDgCallbackResponse>("/api/auth/dg/callback", { params });
