import { apiClient } from "@repo/lib";

import type { PostClientInfoRequest, PostClientInfoResponse } from "../model/types";

export const postClientInfo = (body: PostClientInfoRequest) =>
  apiClient.post<PostClientInfoResponse>("/api/additional-info/client", body);
