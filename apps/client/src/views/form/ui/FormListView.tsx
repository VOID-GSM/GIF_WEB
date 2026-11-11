"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { FormCard, FORM_TABLE_GRID, useGetFormList } from "@/entities/form";
import { useGetMyProject } from "@/entities/project";
import { useGetFormSubmitters } from "@/entities/form-submissions";

export default function FormListView() {
  const t = useTranslations("form.list");
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

  // 제출자 이름 표시: 제출된 양식들의 my-submit(submittedByName)을 병렬 조회한다.
  const submittedFormIds = (forms ?? [])
    .filter((form) => form.submitted)
    .map((form) => form.id);
  const submitterNameMap = useGetFormSubmitters(submittedFormIds, projectId);
  const getSubmitterName = (formId: number) => submitterNameMap.get(formId);

  const handleSubmit = (id: number) => router.push(`/form/${id}/submit`);
  const handleEdit = (id: number) => router.push(`/form/${id}/edit`);

  const isLoading = isProjectsLoading || (!!projectId && isFormsLoading);
  const isError = isProjectsError || isFormsError;
  const hasNoProject = !isProjectsLoading && !isProjectsError && !projectId;
  const isEmpty = !forms || forms.length === 0;
  const showMessage = isLoading || isError || hasNoProject || isEmpty;

  return (
    <div
      className={`flex min-h-dvh flex-col items-center bg-background px-4 ${
        showMessage ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className={`flex max-h-[calc(100dvh-160px)] w-full max-w-[848px] flex-col gap-5 overflow-y-auto px-2 py-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          showMessage ? "" : "pt-[60px] sm:pt-[100px]"
        }`}
      >
        {isLoading ? (
          <p className="py-20 text-center text-gray-500">{t("loading")}</p>
        ) : isError ? (
          <p className="py-20 text-center text-gray-500">
            {t("loadError")}
          </p>
        ) : hasNoProject ? (
          <p className="py-20 text-center text-gray-500">
            {t("noProject")}
          </p>
        ) : !forms || forms.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            {t("empty")}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* 헤더 행 — 각 컬럼이 무엇인지 명시 */}
            <div
              className={`${FORM_TABLE_GRID} border-b border-orange-400 bg-orange-50 px-4 py-2.5`}
            >
              <span className="text-sm font-semibold text-gray-700">{t("title")}</span>
              <span className="text-sm font-semibold text-gray-700">{t("deadlineDate")}</span>
              <span className="text-sm font-semibold text-gray-700">{t("deadlineTime")}</span>
              <span className="text-sm font-semibold text-gray-700">{t("submitted")}</span>
              <span className="text-sm font-semibold text-gray-700">{t("submitter")}</span>
              <span className="text-sm font-semibold text-gray-700">{t("action")}</span>
            </div>

            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                submitterName={getSubmitterName(form.id)}
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
