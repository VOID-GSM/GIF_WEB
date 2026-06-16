"use client";

import { useRouter } from "next/navigation";

import { useGetProject } from "@/entities/project";

import ProjectEditForm from "@/widgets/project-detail/ui/ProjectEditForm";

interface ProjectEditViewProps {
  projectId: number;
}

// 수정 페이지 — 생성 페이지와 동일한 폼 레이아웃, 완료 시 상세로 복귀
export default function ProjectEditView({ projectId }: ProjectEditViewProps) {
  const router = useRouter();

  const { data: project, isPending, isError } = useGetProject(projectId);

  if (isPending || isError || !project) {
    return (
      <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center px-4">
        <p className="text-[14px] text-gray-600">
          {isError ? "프로젝트를 불러오지 못했습니다." : "불러오는 중..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-start justify-center px-4 py-8 sm:items-center">
      <ProjectEditForm
        project={project}
        onDone={() => router.push(`/projects/${projectId}`)}
      />
    </div>
  );
}
