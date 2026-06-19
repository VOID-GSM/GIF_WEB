import { apiClient } from "@repo/lib";

import type { PostClientInfoRequest } from "../model/types";

export const postClientInfo = (body: PostClientInfoRequest) =>
  apiClient.post("/api/additional-info/client", body);
