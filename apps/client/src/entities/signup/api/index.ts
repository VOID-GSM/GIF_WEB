import { apiClient } from "@repo/lib";

import type { PatchClientInfoRequest } from "../model/types";

export const patchClientInfo = (body: PatchClientInfoRequest) =>
  apiClient.patch("/api/additional-info/client", body);
