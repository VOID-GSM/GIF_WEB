import { projectQueryKeys } from "@/entities/project";

// 상세·목록은 project 엔티티의 키를 그대로 써서 같은 캐시를 갱신한다.
export const engagementQueryKeys = {
  projectDetail: projectQueryKeys.detail,
  projectFilter: projectQueryKeys.filters,
  comments: (projectId: number) => ["project", "comments", projectId] as const,
};
