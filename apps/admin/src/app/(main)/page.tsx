import { Suspense } from "react";

import ProjectListView from "@/views/project-list/ui/ProjectListView";

export default function Home() {
  return (
    <Suspense>
      <ProjectListView />
    </Suspense>
  );
}
