import { apiClient } from "@repo/lib";

import type { GetFormsResponse } from "../model/types";

export const getForms = async (projectId: number): Promise<GetFormsResponse> => {
  const { data } = await apiClient.get<GetFormsResponse>("/api/form", {
    params: { projectId },
  });
  return data;
};
