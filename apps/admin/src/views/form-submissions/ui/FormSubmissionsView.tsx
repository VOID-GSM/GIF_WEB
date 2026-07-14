"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GRADES, useGetFilteredProjects, useStoredGrade } from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";
import { formatDeadlineDate, formatDeadlineTime } from "@/entities/form";
import {
  useAdminFormDetail,
  useAdminSubmitDetail,
} from "@/entities/from-management/api/query";
import FormPreviewModal from "./FormPreviewModal";

// 헤더 행과 데이터 행이 동일한 컬럼 폭을 공유하도록 그리드 정의를 한곳에서 관리한다.
// 컬럼: 팀명 / 양식명 / 마감 날짜 / 마감 시간 / 제출 여부
const SUBMISSION_TABLE_GRID =
  "grid grid-cols-[1fr_1fr_130px_84px_100px] gap-4 items-center min-w-[680px]";

type Props = { formId: number };

type SubmissionFilter = "ALL" | "SUBMITTED" | "UNSUBMITTED";

export default function FormSubmissionsView({ formId }: Props) {
  // 마지막으로 선택한 학년을 복원한다 (확정 전엔 null → 초기 학년 깜빡임 방지)
  const { grade: selectedGrade, setGrade: setSelectedGrade } =
    useStoredGrade("formSubmissionsGrade");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [submissionFilter, setSubmissionFilter] =
    useState<SubmissionFilter>("ALL");
  const router = useRouter();

  // 같은 필터를 다시 누르면 선택 해제되어 전체 목록으로 돌아간다
  const toggleSubmissionFilter = (value: SubmissionFilter) => {
    setSubmissionFilter((prev) => (prev === value ? "ALL" : value));
  };

  const { data: projects, isLoading: projectsLoading } = useGetFilteredProjects(
    selectedGrade ?? GRADES[0],
    selectedGrade !== null,
  );
  const { data: submissions, isLoading: submissionsLoading } =
    useAdminSubmitDetail(formId);
  const { data: form } = useAdminFormDetail(formId);

  // 학년 복원 전(null)에도 로딩으로 처리해 초기 깜빡임을 막는다
  const isLoading =
    selectedGrade === null || projectsLoading || submissionsLoading;

  // 마감 날짜/시간은 양식(form) 단위 값이라 행마다 동일 — 루프 밖에서 한 번만 계산한다.
  const deadlineDate = formatDeadlineDate(form?.deadline ?? "");
  const deadlineTime = formatDeadlineTime(form?.deadline ?? "");

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

  // 제출/미제출 필터 — 선택 없으면(ALL) 전체 목록을 그대로 보여준다
  const filteredRows = rows.filter((row) => {
    if (submissionFilter === "SUBMITTED") return row.submitted;
    if (submissionFilter === "UNSUBMITTED") return !row.submitted;
    return true;
  });

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-6 sm:gap-12 sm:py-10">
      {/* 880px 미만: [뒤로 / 미리보기] 한 줄 + 필터 아래 / 880px+: 필터 중앙, 양옆 버튼 */}
      <div className="flex w-full max-w-[800px] flex-col items-center gap-4 min-[880px]:relative min-[880px]:flex-row min-[880px]:justify-center min-[880px]:gap-0">
        <div className="flex w-full items-center justify-between min-[880px]:contents">
          <button
            onClick={() => router.back()}
            className="z-10 flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-gray-900 cursor-pointer min-[880px]:absolute min-[880px]:left-0 min-[880px]:top-1/2 min-[880px]:-translate-y-1/2 min-[880px]:text-lg"
          >
            ← 뒤로
          </button>
          <div className="z-10 flex items-center gap-2 min-[880px]:absolute min-[880px]:right-0 min-[880px]:top-1/2 min-[880px]:-translate-y-1/2">
            <button
              type="button"
              onClick={() => toggleSubmissionFilter("SUBMITTED")}
              className={`flex items-center gap-2 rounded-[10px] border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-[880px]:px-4 min-[880px]:py-2 min-[880px]:text-sm ${
                submissionFilter === "SUBMITTED"
                  ? "border-yellow-600 bg-yellow-50 text-gray-900"
                  : "border-gray-200 bg-gray-100 text-gray-700"
              }`}
            >
              제출
            </button>
            <button
              type="button"
              onClick={() => toggleSubmissionFilter("UNSUBMITTED")}
              className={`flex items-center gap-2 rounded-[10px] border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer min-[880px]:px-4 min-[880px]:py-2 min-[880px]:text-sm ${
                submissionFilter === "UNSUBMITTED"
                  ? "border-yellow-600 bg-yellow-50 text-gray-900"
                  : "border-gray-200 bg-gray-100 text-gray-700"
              }`}
            >
              미제출
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!form}
              className="flex items-center gap-2 rounded-[10px] border border-yellow-600 bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-[880px]:px-4 min-[880px]:py-2 min-[880px]:text-sm"
            >
              폼 미리보기
            </button>
          </div>
        </div>
        <GradeFilter
          value={selectedGrade ?? GRADES[0]}
          onChange={setSelectedGrade}
        />
      </div>

      {isLoading ? (
        <div className="pt-20 text-gray-500 font-medium">로딩중...</div>
      ) : rows.length === 0 ? (
        <div className="pt-20 text-gray-500 font-medium">
          등록된 팀이 없습니다.
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="pt-20 text-gray-500 font-medium">
          {submissionFilter === "SUBMITTED"
            ? "제출한 팀이 없습니다."
            : "미제출한 팀이 없습니다."}
        </div>
      ) : (
        <div className="w-full max-w-[800px] overflow-x-auto rounded-xl bg-white shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* 헤더 행 — 각 컬럼이 무엇인지 명시 */}
          <div
            className={`${SUBMISSION_TABLE_GRID} border-b border-orange-400 bg-orange-50 px-4 py-2.5`}
          >
            <span className="text-sm font-semibold text-gray-700">팀명</span>
            <span className="text-sm font-semibold text-gray-700">양식명</span>
            <span className="text-sm font-semibold text-gray-700">마감 날짜</span>
            <span className="text-sm font-semibold text-gray-700">마감 시간</span>
            <span className="text-sm font-semibold text-gray-700">제출 여부</span>
          </div>

          {filteredRows.map((row) => (
              <div
                key={row.projectId}
                className={`${SUBMISSION_TABLE_GRID} border-b border-gray-100 px-4 py-4 transition-colors hover:bg-yellow-50
                ${row.submitted ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => {
                  if (!row.submitted || row.submitId == null) return;
                  router.push(`/form/submissions/${formId}/${row.submitId}`);
                }}
              >
                {/* 팀명 */}
                <span className="min-w-0 truncate text-base font-medium">
                  {row.teamName}
                </span>

                {/* 양식명 */}
                <span className="min-w-0 truncate text-sm text-gray-700">
                  {form?.title}
                </span>

                {/* 마감 날짜 */}
                <span className="text-sm text-gray-700">{deadlineDate}</span>

                {/* 마감 시간 */}
                <span className="text-sm text-gray-700">{deadlineTime || "—"}</span>

                {/* 제출 여부 */}
                <div className="flex justify-start">
                  <span
                    className={`inline-flex w-16 items-center justify-center rounded-lg border py-1 text-sm ${
                      row.submitted
                        ? "border-yellow-600 bg-yellow-50"
                        : "border-gray-200 bg-gray-100 text-gray-500"
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
