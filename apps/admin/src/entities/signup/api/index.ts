import { apiClient } from "@repo/lib";

import type { PostAdminInfoRequest } from "../model/types";

export const postAdminInfo = (body: PostAdminInfoRequest) =>
  apiClient.post("/api/additional-info/admin", body);
