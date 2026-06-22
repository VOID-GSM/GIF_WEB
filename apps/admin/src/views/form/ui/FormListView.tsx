"use client";

import { useRouter } from "next/navigation";

import {
  FormCard,
  useAnnounceForm,
  useDeleteForm,
  useGetFormList,
} from "@/entities/form";

export default function FormListView() {
  const router = useRouter();

  const { data: forms, isLoading, isError } = useGetFormList();
  const { mutate: announce } = useAnnounceForm();
  const { mutate: remove } = useDeleteForm();

  const handleCreate = () => router.push("/form/create");
  const handleEdit = (id: number) => router.push(`/form/edit/${id}`);
  const handleView = (id: number) => router.push(`/form/submissions/${id}`);

  return (
    <div className="flex min-h-[calc(100dvh-80px)] flex-col items-center bg-background px-4 pt-12 pb-4 sm:pt-20">
      <div className="flex max-h-[calc(100vh-160px)] w-full max-w-[848px] flex-col overflow-y-auto px-2 py-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-xl bg-yellow-600 px-[46px] py-[10px] text-xl text-black font-medium shadow transition-all duration-150 hover:bg-yellow-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50"
          >
            생성하기
          </button>
        </div>

        {isLoading ? (
          <p className="py-20 text-center text-gray-500">불러오는 중...</p>
        ) : isError ? (
          <p className="py-20 text-center text-gray-500">
            양식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : !forms || forms.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            등록된 양식이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onAnnounce={announce}
                onEdit={handleEdit}
                onDelete={remove}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
