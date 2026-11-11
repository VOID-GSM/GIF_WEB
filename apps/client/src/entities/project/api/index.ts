import { apiClient } from "@repo/lib";

import type {
  GetFilteredProjectsResponse,
  GetMyProjectResponse,
  GradeFilterValue,
} from "../model/types";

export const getMyProject = () =>
  apiClient.get<GetMyProjectResponse>("/api/project/me");

// 전체("all")는 grade 없이 호출한다 — 서버는 grade를 생략하면 전체 학년을 반환한다.
export const getFilteredProjects = (grade: GradeFilterValue) =>
  apiClient.get<GetFilteredProjectsResponse>("/api/project/filter", {
    params: grade === "all" ? undefined : { grade },
  });
