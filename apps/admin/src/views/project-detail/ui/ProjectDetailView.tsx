"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { DeadlineStatusSection, FormListSection, ProjectInfo } from "@repo/ui";

import { getDeadlineSummary, useGetForms } from "@/entities/form";
import { getAdminSubmitDetail } from "@/entities/from-management/api/api";
import { formKeys } from "@/entities/from-management/api/query";
import { useGetProject } from "@/entities/project";
import AiSummarySection from "@/widgets/project-detail/ui/AiSummarySection";
import MemoSection from "@/widgets/project-detail/ui/MemoSection";
import ScoreAssignSection from "@/widgets/project-detail/ui/ScoreAssignSection";

interface ProjectDetailViewProps {
  projectId: number;
}

// 관리자 프로젝트 상세 — 모든 팀의 마감현황·양식 목록 열람, 일정 대신 메모
export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: project, isPending, isError } = useGetProject(projectId);
  const { data: forms } = useGetForms(projectId);

  // 양식 클릭 → 이 팀이 제출한 양식 상세로 이동.
  // forms 목록에는 submitId가 없어, 양식별 제출 내역을 조회해 이 프로젝트의 제출을 찾는다.
  const handleFormClick = async (formId: number) => {
    try {
      const submissions = await queryClient.fetchQuery({
        queryKey: formKeys.adminSubmitDetail(formId),
        queryFn: () => getAdminSubmitDetail(formId),
      });
      const submission = submissions.find((s) => s.projectId === projectId);
      if (!submission) {
        toast.error("이 팀이 제출한 양식이 없습니다.");
        return;
      }
      router.push(`/form/submissions/${formId}/${submission.submitId}`);
    } catch {
      toast.error("양식을 불러오지 못했습니다.");
    }
  };

  if (isPending || isError || !project) {
    return (
      <div className="flex min-h-[calc(100dvh-60px)] items-center justify-center px-4">
        <p className="text-[14px] text-gray-600">
          {isError ? "프로젝트를 불러오지 못했습니다." : "불러오는 중..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.75rem)] justify-center bg-background px-4 pb-8 pt-[67px]">
      <div className="flex w-full min-w-0 max-w-[830px] flex-col">
        {/* 정보 영역 — 클라이언트 상세와 동일한 레이아웃 */}
        {/* AI 요약은 로고 영역과 설명 사이에 노출 */}
        <ProjectInfo
          project={project}
          summary={<AiSummarySection projectId={projectId} />}
        />

        {/* 마감현황 · 양식 목록 (좌) / 메모 (우) */}
        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12">
          {/* 좌측: 메모(우측) 높이에 맞춰 늘어나고, 양식 목록이 남는 공간을 채우며 스크롤 */}
          <div className="flex flex-1 flex-col gap-8 lg:min-h-0">
            <DeadlineStatusSection summary={getDeadlineSummary(forms ?? [])} />
            <FormListSection forms={forms ?? []} onFormClick={handleFormClick} />
          </div>
          <MemoSection key={projectId} projectId={projectId} />
        </div>

        {/* 하단 — 역할별 점수 부여 버튼 */}
        <ScoreAssignSection projectId={projectId} />
      </div>
    </div>
  );
}
