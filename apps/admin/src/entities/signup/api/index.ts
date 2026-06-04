import { apiClient } from "@repo/lib";

import type { PostSignupRequest, PostSignupResponse } from "../model/types";

export const postSignup = (body: PostSignupRequest) =>
  apiClient.post<PostSignupResponse>("/api/auth/signup", body);
