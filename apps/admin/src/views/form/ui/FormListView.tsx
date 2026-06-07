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

  const { data: forms, isLoading } = useGetFormList();
  const { mutate: announce } = useAnnounceForm();
  const { mutate: remove } = useDeleteForm();

  const handleCreate = () => router.push("/form/create");
  const handleEdit = (id: number) => router.push(`/form/edit/${id}`);

  return (
    <div className="flex flex-col items-center pt-20 pb-4 py-10">
      <div className="flex max-h-[calc(100vh-160px)] w-[848px] flex-col overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-yellow-600 px-[46px] py-[10px] text-xl text-black font-medium shadow"
          >
            생성하기
          </button>
        </div>

        {isLoading ? (
          <p className="py-20 text-center text-gray-500">불러오는 중...</p>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
