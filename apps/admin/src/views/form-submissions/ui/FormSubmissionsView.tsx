"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetFilteredProjects } from "@/entities/project";
import type { Grade } from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";
import {
  useAdminFormDetail,
  useAdminSubmitDetail,
} from "@/entities/from-management/api/query";
import FormPreviewModal from "./FormPreviewModal";

type Props = { formId: number };

export default function FormSubmissionsView({ formId }: Props) {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();

  const { data: projects, isLoading: projectsLoading } =
    useGetFilteredProjects(selectedGrade);
  const { data: submissions, isLoading: submissionsLoading } =
    useAdminSubmitDetail(formId);
  const { data: form } = useAdminFormDetail(formId);

  const isLoading = projectsLoading || submissionsLoading;

  // 학년별 팀 목록에 양식 제출 내역을 합쳐 팀별 제출 여부를 만든다
  const rows = (projects ?? []).map((project) => {
    const submission = submissions?.find((s) => s.projectId === project.id);
    return {
      projectId: project.id,
      teamName: project.teamName,
      submitId: submission?.submitId ?? null,
      submitted: !!submission,
    };
  });

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-6 sm:gap-12 sm:py-10">
      {/* 모바일: [뒤로 / 미리보기] 한 줄 + 필터 아래 / sm+: 필터 중앙, 양옆 버튼 */}
      <div className="flex w-full max-w-[800px] flex-col items-center gap-4 sm:relative sm:flex-row sm:justify-center sm:gap-0">
        <div className="flex w-full items-center justify-between sm:contents">
          <button
            onClick={() => router.back()}
            className="z-10 flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-gray-900 cursor-pointer sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:text-lg"
          >
            ← 뒤로
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            disabled={!form}
            className="z-10 flex items-center gap-2 rounded-[10px] border border-yellow-600 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:px-4 sm:py-2 sm:text-sm"
          >
            폼 미리보기
          </button>
        </div>
        <GradeFilter value={selectedGrade} onChange={setSelectedGrade} />
      </div>

      {isLoading ? (
        <div className="pt-20 text-gray-500 font-medium">로딩중...</div>
      ) : rows.length === 0 ? (
        <div className="pt-20 text-gray-500 font-medium">
          등록된 팀이 없습니다.
        </div>
      ) : (
        <div className="flex w-full max-w-[800px] flex-col gap-3 sm:gap-4">
          {rows.map((row) => (
            <div
              key={row.projectId}
              className={`flex min-h-[64px] w-full items-center justify-between gap-3 rounded-[12px] bg-white px-4 shadow sm:h-20 sm:gap-8 sm:pl-8 sm:pr-17
              ${row.submitted ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={() => {
                if (!row.submitted || row.submitId == null) return;
                router.push(`/form/submissions/${formId}/${row.submitId}`);
              }}
            >
              {/* 좌측: 모바일은 팀명/양식명 세로, sm+는 가로 */}
              <div className="flex min-w-0 flex-col gap-0.5 font-medium sm:flex-row sm:gap-8 sm:text-[20px]">
                <span className="truncate">{row.teamName}</span>
                <span className="truncate text-sm text-gray-600 sm:text-[20px] sm:text-black">
                  {form?.title}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3 font-medium sm:gap-16 sm:text-[20px]">
                {/* 마감일은 공간이 좁은 모바일에서는 숨김 */}
                <span className="hidden sm:inline">{form?.deadline}</span>
                <span
                  className={`flex w-16 items-center justify-center rounded-[12px] border py-[5px] text-xs sm:w-20 sm:text-base ${
                    row.submitted
                      ? "border-yellow-600 bg-yellow-50"
                      : "border-gray-200 bg-gray-100"
                  }`}
                >
                  {row.submitted ? "제출" : "미제출"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPreviewOpen && form && (
        <FormPreviewModal form={form} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
}
