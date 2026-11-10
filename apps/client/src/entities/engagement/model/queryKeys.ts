import { projectQueryKeys } from "@/entities/project";

// 상세·목록은 project 엔티티의 키를 그대로 써서 같은 캐시를 갱신한다.
// projectDetail 은 교내용·공개 상세 캐시의 공통 prefix 이므로
// setQueryData(정확히 일치) 대신 setQueriesData(prefix 일치)로 갱신해야 둘 다 반영된다.
export const engagementQueryKeys = {
  projectDetail: projectQueryKeys.detail,
  projectFilter: projectQueryKeys.filters,
  comments: (projectId: number) => ["project", "comments", projectId] as const,
};
