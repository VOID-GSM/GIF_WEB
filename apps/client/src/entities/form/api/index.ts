import { apiClient } from "@repo/lib";

import type { GetFormListResponse } from "../model/types";

export const getFormList = (projectId: number) =>
  apiClient.get<GetFormListResponse>("/api/form", { params: { projectId } });
