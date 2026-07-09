import { Suspense } from "react";

import ProjectListView from "@/views/project-list/ui/ProjectListView";
import RightSidebar from "@/widgets/dashboard/ui/RightSidebar";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-6 bg-background px-0 md:flex-row md:items-start md:px-6">
      <div className="min-w-0 flex-1">
        <Suspense>
          <ProjectListView />
        </Suspense>
      </div>
      <RightSidebar />
    </div>
  );
}
