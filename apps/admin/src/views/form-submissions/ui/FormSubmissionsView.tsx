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

type Props = { formId: number };

export default function FormSubmissionsView({ formId }: Props) {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
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
    <div className="flex flex-col items-center gap-12 px-4 py-10">
      {/* 메인 페이지와 동일한 높이·위치로 학년 필터는 중앙, 뒤로 버튼은 카드 시작점(좌측) */}
      <div className="relative flex w-200 justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          ← 뒤로
        </button>
        <GradeFilter value={selectedGrade} onChange={setSelectedGrade} />
      </div>

      {isLoading ? (
        <div className="pt-20 text-gray-500 font-medium">로딩중...</div>
      ) : rows.length === 0 ? (
        <div className="pt-20 text-gray-500 font-medium">
          등록된 팀이 없습니다.
        </div>
      ) : (
        <div className="flex w-200 flex-col gap-4">
          {rows.map((row) => (
            <div
              key={row.projectId}
              className={`flex items-center justify-between h-20 w-200 pl-8 pr-17 bg-white rounded-[12px] shadow
              ${row.submitted ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={() => {
                if (!row.submitted || row.submitId == null) return;
                router.push(`/form/submissions/${formId}/${row.submitId}`);
              }}
            >
              <div className="flex gap-8 text-5 font-medium">
                <span>{row.teamName}</span>
                <span>{form?.title}</span>
              </div>

              <div className="flex items-center gap-16 text-5 font-medium">
                <span>{form?.deadline}</span>
                <span
                  className={`flex items-center justify-center w-20 py-[5px] border rounded-[12px] text-4 ${
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
    </div>
  );
}
