"use client";

import { useRouter } from "next/navigation";

import {
  FormCard,
  FORM_TABLE_GRID,
  useAnnounceForm,
  useDeleteForm,
  useGetFormList,
} from "@/entities/form";
import { useGetMyInfo } from "@/entities/mypage";

export default function FormListView() {
  const router = useRouter();

  const { data: forms, isLoading: isFormsLoading, isError } = useGetFormList();
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  const { mutate: announce } = useAnnounceForm();
  const { mutate: remove } = useDeleteForm();

  // myInfo 로딩까지 함께 기다려 생성/삭제 버튼이 늦게 나타나는 레이아웃 시프트를 막는다.
  const isLoading = isFormsLoading || isMyInfoLoading;

  // 양식 생성·공지·수정·삭제는 아이디어페스티벌 담당(MASTER)만 가능
  const isMaster = myInfo?.adminRole === "MASTER";

  // 일반 선생님은 공지된 양식만 볼 수 있고, 담당(MASTER)은 미공지 양식까지 모두 본다.
  const visibleForms = isMaster
    ? forms
    : forms?.filter((form) => form.announced);

  const handleCreate = () => router.push("/form/create");
  const handleEdit = (id: number) => router.push(`/form/edit/${id}`);
  const handleView = (id: number) => router.push(`/form/submissions/${id}`);

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 pt-12 pb-4 sm:pt-20">
      <div className="flex max-h-[calc(100vh-160px)] w-full max-w-[848px] flex-col overflow-y-auto px-2 py-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isMaster && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleCreate}
              className="cursor-pointer rounded-lg bg-yellow-600 px-7 py-2.5 text-base text-black font-medium shadow transition-all duration-150 hover:bg-yellow-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-600/50"
            >
              생성하기
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="py-20 text-center text-gray-500">불러오는 중...</p>
        ) : isError ? (
          <p className="py-20 text-center text-gray-500">
            양식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : !visibleForms || visibleForms.length === 0 ? (
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
              <span className="text-sm font-semibold text-gray-700">공지</span>
              <span className="text-sm font-semibold text-gray-700">관리</span>
            </div>

            {visibleForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onAnnounce={isMaster ? announce : undefined}
                onEdit={isMaster ? handleEdit : undefined}
                onDelete={isMaster ? remove : undefined}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
