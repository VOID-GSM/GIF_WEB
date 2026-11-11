import type { GradeFilterValue } from "./types";

// 프로젝트 캐시 키 — 참여 지표(engagement) 등 다른 엔티티도 이 키로 같은 캐시를 갱신한다.
export const projectQueryKeys = {
  // 교내 사용자용 상세. 공개 상세(publicDetail)의 prefix 이기도 해서
  // detail(id) 로 무효화·갱신(setQueriesData)하면 두 캐시에 함께 반영된다.
  detail: (projectId: number) => ["project", "detail", projectId] as const,
  // 공개 상세 — 응답 형태(ProjectDetailResponse)가 달라 교내용 캐시와 키를 나눈다.
  publicDetail: (projectId: number) =>
    ["project", "detail", projectId, "public"] as const,
  filters: () => ["project", "filter"] as const,
  filter: (grade: GradeFilterValue) => ["project", "filter", grade] as const,
};
