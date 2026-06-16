"use client";

import { getDeadlineSummary, useGetForms } from "@/entities/form";
import { useGetProject } from "@/entities/project";
import DeadlineStatusSection from "@/widgets/project-detail/ui/DeadlineStatusSection";
import FormListSection from "@/widgets/project-detail/ui/FormListSection";
import MemoSection from "@/widgets/project-detail/ui/MemoSection";
import ProjectInfo from "@/widgets/project-detail/ui/ProjectInfo";

interface ProjectDetailViewProps {
  projectId: number;
}

// 관리자 프로젝트 상세 — 모든 팀의 마감현황·양식 목록 열람, 일정 대신 메모
export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isPending, isError } = useGetProject(projectId);
  const { data: forms } = useGetForms(projectId);

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
    <div className="flex min-h-[calc(100vh-5rem)] justify-center bg-background px-4 pb-8 pt-[87px]">
      <div className="flex w-full min-w-0 max-w-[830px] flex-col">
        {/* 정보 영역 — 클라이언트 상세와 동일한 레이아웃 */}
        <ProjectInfo project={project} />

        {/* 마감현황 · 양식 목록 (좌) / 메모 (우) */}
        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-1 flex-col gap-8">
            <DeadlineStatusSection summary={getDeadlineSummary(forms ?? [])} />
            <FormListSection forms={forms ?? []} />
          </div>
          <MemoSection key={projectId} projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
