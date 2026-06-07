"use client";

import { useRouter } from "next/navigation";

import { FormCard, useGetFormList } from "@/entities/form";
import { useGetMyProjects } from "@/entities/project";

export default function FormListView() {
  const router = useRouter();

  const { data: projects } = useGetMyProjects();
  const projectId = projects?.[0]?.id ?? 0;

  const { data: forms, isLoading } = useGetFormList(projectId);

  const handleOpen = (id: number) => router.push(`/form/${id}`);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
      <div className="flex max-h-[calc(100vh-160px)] w-[848px] flex-col gap-5 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading ? (
          <p className="py-20 text-center text-gray-500">불러오는 중...</p>
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
