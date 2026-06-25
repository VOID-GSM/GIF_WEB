"use client";

import { useRouter } from "next/navigation";

import { useGetMe } from "@/entities/auth";
import { useGetProject } from "@/entities/project";

import ProjectEditForm from "@/widgets/project-detail/ui/ProjectEditForm";

interface ProjectEditViewProps {
  projectId: number;
}

// 수정 페이지 — 생성 페이지와 동일한 폼 레이아웃, 완료 시 상세로 복귀
export default function ProjectEditView({ projectId }: ProjectEditViewProps) {
  const router = useRouter();

  const { data: project, isPending, isError } = useGetProject(projectId);
  // me가 로드된 후에만 폼을 렌더 — 오너가 팀원 목록 초기값에 섞이지 않도록 (캐시되어 하위에서 즉시 사용)
  const { data: me, isPending: isMePending } = useGetMe();

  if (isPending || isMePending || isError || !project || !me) {
    return (
      <div className="flex min-h-[calc(100dvh-60px)] items-center justify-center bg-background px-4">
        <p className="text-[14px] text-gray-600">
          {isError ? "프로젝트를 불러오지 못했습니다." : "불러오는 중..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.75rem)] items-start justify-center bg-background px-4 py-8 sm:items-center">
      <ProjectEditForm
        project={project}
        onDone={() => router.push(`/projects/${projectId}`)}
      />
    </div>
  );
}
