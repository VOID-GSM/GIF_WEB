import { apiClient } from "@repo/lib";

import type { GetFormsResponse } from "../model/types";

export const getForms = (projectId: number) =>
  apiClient.get<GetFormsResponse>("/api/form", {
    params: { projectId },
  });
