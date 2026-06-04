import { apiClient } from "@repo/lib";

import type { PatchAdminInfoRequest } from "../model/types";

export const patchAdminInfo = (body: PatchAdminInfoRequest) =>
  apiClient.patch("/api/additional-info/admin", body);
