"use client";

import { useRouter } from "next/navigation";

import { FormCard, useGetFormList } from "@/entities/form";
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

  const handleOpen = (id: number) => router.push(`/form/${id}`);

  const isLoading = isProjectsLoading || (!!projectId && isFormsLoading);
  const isError = isProjectsError || isFormsError;
  const hasNoProject = !isProjectsLoading && !isProjectsError && !projectId;

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
      <div className="flex max-h-[calc(100vh-160px)] w-[848px] flex-col gap-5 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          forms.map((form) => (
            <FormCard key={form.id} form={form} onOpen={handleOpen} />
          ))
        )}
      </div>
    </div>
  );
}
