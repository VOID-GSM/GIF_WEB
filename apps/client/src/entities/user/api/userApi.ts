import { apiClient } from "@repo/lib";

import type {
  CurrentUserResponse,
  GithubConnectRequest,
} from "../model/types";

export const getCurrentUser = async () => {
  const { data } = await apiClient.get<CurrentUserResponse>("/api/users/me");
  return data;
};

export const connectGithub = async (body: GithubConnectRequest) => {
  const { data } = await apiClient.post<CurrentUserResponse>(
    "/api/users/me/github",
    body,
  );
  return data;
};

export const disconnectGithub = async () => {
  const { data } = await apiClient.delete<CurrentUserResponse>(
    "/api/users/me/github",
  );
  return data;
};

// 연동된 GitHub 커밋 수를 다시 집계해 코인을 지급받는다.
export const syncGithub = async () => {
  const { data } = await apiClient.post<CurrentUserResponse>(
    "/api/users/me/github/sync",
  );
  return data;
};
