"use client";

import { useRouter } from "next/navigation";

import { FormCard, FORM_TABLE_GRID, useGetFormList } from "@/entities/form";
import { useGetMyProject } from "@/entities/project";

export default function FormListView() {
  const router = useRouter();

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetMyProject();
  const projectId = projects?.[0]?.id;

  const {
    data: forms,
    isLoading: isFormsLoading,
    isError: isFormsError,
  } = useGetFormList(projectId);

  const handleSubmit = (id: number) => router.push(`/form/${id}/submit`);
  const handleEdit = (id: number) => router.push(`/form/${id}/edit`);

  const isLoading = isProjectsLoading || (!!projectId && isFormsLoading);
  const isError = isProjectsError || isFormsError;
  const hasNoProject = !isProjectsLoading && !isProjectsError && !projectId;
  const isEmpty = !forms || forms.length === 0;
  const showMessage = isLoading || isError || hasNoProject || isEmpty;

  return (
    <div
      className={`flex min-h-[calc(100vh-60px)] flex-col items-center bg-background px-4 ${
        showMessage ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className={`flex max-h-[calc(100vh-160px)] w-full max-w-[848px] flex-col gap-5 overflow-y-auto px-2 py-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          showMessage ? "" : "pt-[60px] sm:pt-[100px]"
        }`}
      >
        {isLoading ? (
          <p className="py-20 text-center text-gray-500">불러오는 중...</p>
        ) : isError ? (
          <p className="py-20 text-center text-gray-500">
            양식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : hasNoProject ? (
          <p className="py-20 text-center text-gray-500">
            소속된 프로젝트가 없습니다.
          </p>
        ) : !forms || forms.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            등록된 양식이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* 헤더 행 — 각 컬럼이 무엇인지 명시 */}
            <div
              className={`${FORM_TABLE_GRID} border-b border-orange-400 bg-orange-50 px-4 py-2.5`}
            >
              <span className="text-sm font-semibold text-gray-700">제목</span>
              <span className="text-sm font-semibold text-gray-700">마감 날짜</span>
              <span className="text-sm font-semibold text-gray-700">마감 시간</span>
              <span className="text-sm font-semibold text-gray-700">제출 여부</span>
              <span className="text-sm font-semibold text-gray-700">작업</span>
            </div>

            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onSubmit={handleSubmit}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
