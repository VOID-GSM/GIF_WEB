// project 엔티티의 키와 같은 형태를 유지해야 캐시가 공유된다.
export const engagementQueryKeys = {
  projectDetail: (projectId: number) => ["project", "detail", projectId] as const,
  projectFilter: () => ["project", "filter"] as const,
  comments: (projectId: number) => ["project", "comments", projectId] as const,
};
