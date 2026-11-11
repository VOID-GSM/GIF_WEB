import type { QueryClient } from "@tanstack/react-query";

import type { FilteredProject } from "@/entities/project";

import { engagementQueryKeys } from "./queryKeys";

// 학년별 목록 캐시에서 해당 프로젝트 카드만 고친다.
// 목록 전체를 무효화하면 보고 있지 않은 학년까지 다시 불러오므로 직접 갱신한다.
export function updateProjectInLists(
  queryClient: QueryClient,
  projectId: number,
  updater: (project: FilteredProject) => FilteredProject,
) {
  queryClient.setQueriesData<FilteredProject[]>(
    { queryKey: engagementQueryKeys.projectFilter() },
    (old) =>
      old?.map((project) =>
        project.id === projectId ? updater(project) : project,
      ),
  );
}
