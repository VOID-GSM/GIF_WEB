import { apiClient } from "@repo/lib";

import type {
  GetDgCallbackParams,
  GetDgCallbackResponse,
  GetGoogleCallbackParams,
  GetGoogleCallbackResponse,
  GetOAuthCallbackParams,
  GetMyInfoResponse,
  GetMeResponse,
  PostSignInRequest,
  PostSignInResponse,
} from "../model/types";

export const postSignIn = (body: PostSignInRequest) =>
  apiClient.post<PostSignInResponse>("/api/auth/signin", body);

export const getDgCallback = (params: GetDgCallbackParams) =>
  apiClient.get<GetDgCallbackResponse>("/api/auth/dg/callback", { params });

export const getGoogleCallback = (params: GetGoogleCallbackParams) =>
  apiClient.get<GetGoogleCallbackResponse>("/api/auth/google/callback", {
    params,
  });

export const getOAuthCallback = ({ provider, ...params }: GetOAuthCallbackParams) =>
  provider === "google" ? getGoogleCallback(params) : getDgCallback(params);

export const getMyInfo = () => apiClient.get<GetMyInfoResponse>("/api/users/me");

export const getMe = () => apiClient.get<GetMeResponse>("/api/users/me");
