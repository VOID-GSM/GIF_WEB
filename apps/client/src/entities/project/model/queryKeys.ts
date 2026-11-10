import type { Grade } from "./types";

// 프로젝트 캐시 키 — 참여 지표(engagement) 등 다른 엔티티도 이 키로 같은 캐시를 갱신한다.
export const projectQueryKeys = {
  detail: (projectId: number) => ["project", "detail", projectId] as const,
  filters: () => ["project", "filter"] as const,
  filter: (grade: Grade) => ["project", "filter", grade] as const,
};
