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
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
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
    <div className="bg-background pb-24">
      {/* 넷플릭스형 대형 영상 히어로 */}
      <ProjectHero project={project} />

      {/* 하단 정보 — 히어로 위로 살짝 올라오는 라운드 시트 */}
      <div className="relative z-10 -mt-5 rounded-t-[28px] bg-background shadow-[0_-10px_30px_rgba(0,0,0,0.07)]">
        <div className="mx-auto max-w-[1000px] px-5">
          <section className="py-14 md:py-16">
            <ProjectAbout
              description={project.description}
              tagline={project.tagline}
            />
          </section>

          {project.features.length > 0 && (
            <section className="border-t border-gray-100 py-14 md:py-16">
              <ProjectFeatures features={project.features} />
            </section>
          )}

          <section className="border-t border-gray-100 py-14 md:py-16">
            <ProjectTeam members={project.members} leader={project.leader} />
          </section>
        </div>
      </div>
    </div>
  );
}
