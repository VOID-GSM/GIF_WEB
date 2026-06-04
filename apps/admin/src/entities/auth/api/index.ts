import { apiClient } from "@repo/lib";

import type { PostSignInRequest, PostSignInResponse } from "../model/types";

export const postSignIn = (body: PostSignInRequest) =>
  apiClient.post<PostSignInResponse>("/api/auth/signin", body);
