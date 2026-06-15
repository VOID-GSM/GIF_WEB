import { apiClient } from "@repo/lib";
import type { ListProjectResponse } from "../model/types";

export const getProjectsByGrade = (grade: number) =>
  apiClient.get<ListProjectResponse[]>("/api/project/filter", { params: { grade } });
