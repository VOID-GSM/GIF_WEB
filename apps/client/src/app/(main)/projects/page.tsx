import { Suspense } from "react";

import PublicProjectListView from "@/views/project-list/ui/PublicProjectListView";

// 공개 프로젝트 목록 — 로그인 없이 접근할 수 있다 (proxy 의 공개 경로)
export default function ProjectsPage() {
  return (
    <Suspense>
      <PublicProjectListView />
    </Suspense>
  );
}
