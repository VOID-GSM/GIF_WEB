import Link from "next/link";

import { getProjectById } from "@/entities/project";
import ProjectHero from "@/widgets/project-detail/ui/ProjectHero";
import ProjectAbout from "@/widgets/project-detail/ui/ProjectAbout";
import ProjectFeatures from "@/widgets/project-detail/ui/ProjectFeatures";
import ProjectTeam from "@/widgets/project-detail/ui/ProjectTeam";

interface ProjectDetailViewProps {
  projectId: number;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <p className="text-2xl font-medium text-gray-500">
          프로젝트를 찾을 수 없습니다.
        </p>
        <Link
          href="/"
          className="rounded-4xl bg-yellow-600 px-8 py-[10px] text-[16px] font-semibold text-black"
        >
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background pb-20">
      {/* 넷플릭스형 대형 영상 히어로 */}
      <ProjectHero project={project} />

      {/* 하단 정보 */}
      <div className="mx-auto max-w-[1000px] px-4">
        <div className="py-12">
          <ProjectAbout description={project.description} />
        </div>

        {project.features.length > 0 && (
          <div className="border-t border-gray-200 py-12">
            <ProjectFeatures features={project.features} />
          </div>
        )}

        <div className="border-t border-gray-200 py-12">
          <ProjectTeam members={project.members} />
        </div>
      </div>
    </div>
  );
}
