"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetFilteredProjects } from "@/entities/project";
import type { Grade } from "@/entities/project";
import { useAdminSubmitDetail } from "@/entities/from-management/api/query";
import { useGetFormById } from "@/entities/form-edit";

type Props = { formId: number };

export default function FormSubmissionsView({ formId }: Props) {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const router = useRouter();

  const { data: projects, isLoading: projectsLoading } =
    useGetFilteredProjects(selectedGrade);
  const { data: submissions, isLoading: submissionsLoading } =
    useAdminSubmitDetail(formId);
  const { data: form } = useGetFormById(formId);

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
    <div className="min-h-screen flex flex-col pt-20 bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-5 rounded-[32px] bg-white p-2 shadow-new">
          <button
            onClick={() => setSelectedGrade(1)}
            className={`flex rounded-[32px] py-2 px-[38px] text-5 font-medium border cursor-pointer ${
              selectedGrade === 1
                ? "border-yellow-400 bg-yellow-50"
                : "border-white"
            }`}
          >
            1학년
          </button>

          <button
            onClick={() => setSelectedGrade(2)}
            className={`flex rounded-[32px] py-2 px-[38px] text-5 font-medium border cursor-pointer ${
              selectedGrade === 2
                ? "border-yellow-400 bg-yellow-50"
                : "border-white"
            }`}
          >
            2학년
          </button>
        </div>

        {isLoading ? (
          <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
            로딩중...
          </div>
        ) : rows.length === 0 ? (
          <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
            등록된 팀이 없습니다.
          </div>
        ) : (
          rows.map((row) => (
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
          ))
        )}
      </div>
    </div>
  );
}
