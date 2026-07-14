"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormCard, Plus, DatePicker } from "@repo/ui";
import { toast } from "sonner";
import { useUpdateForm, useGetFormById } from "@/entities/form-edit";
import type { FormByIdResponse, UpdateFormField } from "@/entities/form-edit";
import type { PostFormRequestField } from "@/entities/form-create";
import { useGetMyInfo } from "@/entities/mypage";

const FORM_TITLE_MAX_LENGTH = 50;

type FieldWithId = {
  id: string;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR" | "";
  orderIndex: number;
  allowedExtensions: string[];
};

// API는 "DATE"를 반환하지만 FormCard UI는 "CALENDAR"를 사용
function toUiType(apiType: string): "TEXT" | "FILE" | "CALENDAR" | "" {
  if (apiType === "DATE") return "CALENDAR";
  if (apiType === "TEXT" || apiType === "FILE" || apiType === "CALENDAR") return apiType;
  return "";
}

function FormEditor({
  formId,
  formDetail,
}: {
  formId: number;
  formDetail: FormByIdResponse;
}) {
  const router = useRouter();
  const { mutate: updateForm, isPending: isSaving } = useUpdateForm();

  const [formTitle, setFormTitle] = useState(formDetail.title);
  // 한글(IME) 조합 중에는 값을 자르지 않는다 — 조합 도중 강제로 잘라내면
  // composition 세션이 깨져 마지막 글자가 누락되거나 조합이 끊길 수 있다.
  const isTitleComposing = useRef(false);
  const [deadline, setDeadline] = useState(formDetail.deadline);
  const [fields, setFields] = useState<FieldWithId[]>(() =>
    formDetail.fields
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((f) => ({
        id: String(f.id),
        title: f.title,
        description: f.description,
        type: toUiType(f.type),
        orderIndex: f.orderIndex,
        allowedExtensions: f.allowedExtensions ?? [],
      })),
  );

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        type: "",
        orderIndex: prev.length,
        allowedExtensions: [],
      },
    ]);
  };

  const handleDeleteField = (id: string) => {
    if (fields.length === 1) return;
    setFields((prev) =>
      prev.filter((f) => f.id !== id).map((f, i) => ({ ...f, orderIndex: i })),
    );
  };

  const handleChange = (id: string, updated: Partial<PostFormRequestField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    );
  };

  const handleSave = () => {
    updateForm(
      {
        formId,
        body: {
          title: formTitle,
          deadline,
          fields: fields
            .filter((f) => f.type !== "")
            .map(({ title, description, type, orderIndex, allowedExtensions }) => ({
              title,
              description,
              type: type as UpdateFormField["type"],
              orderIndex,
              ...(type === "FILE" ? { allowedExtensions } : {}),
            })),
        },
      },
      {
        onSuccess: () => router.push("/form"),
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-5">
      <span className="pt-20 pb-8 font-semibold text-[24px]">
        양식 수정하기
      </span>
      <div className="w-full max-w-[560px] flex flex-col pb-6 gap-4">
        <div className="flex flex-col text-[14px] font-medium text-gray-600 gap-1">
          제목 입력하기
          <input
            className="w-full py-3 px-4 border border-gray-200 rounded-[10px] text-[18px] font-medium placeholder:text-gray-500 text-black outline-none bg-white"
            placeholder="제목을 입력하세요"
            value={formTitle}
            maxLength={FORM_TITLE_MAX_LENGTH}
            onChange={(e) => {
              const value = e.target.value;
              setFormTitle(
                isTitleComposing.current
                  ? value
                  : value.slice(0, FORM_TITLE_MAX_LENGTH),
              );
            }}
            onCompositionStart={() => {
              isTitleComposing.current = true;
            }}
            onCompositionEnd={(e) => {
              isTitleComposing.current = false;
              setFormTitle(
                e.currentTarget.value.slice(0, FORM_TITLE_MAX_LENGTH),
              );
            }}
          />
          <span className="self-end text-xs text-gray-400">
            {formTitle.length}/{FORM_TITLE_MAX_LENGTH}
          </span>
        </div>
        <div className="flex flex-col text-[14px] font-medium text-gray-600 gap-1">
          마감일 선택하기
          <div>
            <DatePicker value={deadline} onChange={setDeadline} />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[560px] flex flex-col gap-5">
        {fields.map((field) => (
          <FormCard
            key={field.id}
            field={field}
            onChange={handleChange}
            onDelete={handleDeleteField}
          />
        ))}

        <button
          className="w-full flex items-center justify-center py-3 gap-4 bg-white rounded-[10px] shadow-new font-medium cursor-pointer"
          onClick={handleAddField}
        >
          <Plus width={15} height={15} />
          추가하기
        </button>

        <div className="w-full pb-20">
          <button
            className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormEditView({ formId }: { formId: number }) {
  const router = useRouter();
  const { data: formDetail, isLoading, isError } = useGetFormById(formId);

  // 양식 수정은 아이디어페스티벌 담당(MASTER)만 가능 — 그 외 역할·에러는 목록으로 돌려보낸다.
  const {
    data: myInfo,
    isLoading: isMyInfoLoading,
    isError: isMyInfoError,
  } = useGetMyInfo();
  const canEdit = !isMyInfoError && myInfo?.adminRole === "MASTER";

  useEffect(() => {
    // 로딩이 끝났는데(정보 도착 또는 에러) 권한이 없으면 목록으로 보낸다.
    if (!isMyInfoLoading && (myInfo || isMyInfoError) && !canEdit) {
      toast.error("양식 수정 권한이 없습니다.");
      router.replace("/form");
    }
  }, [isMyInfoLoading, myInfo, isMyInfoError, canEdit, router]);

  // 권한 확인 중에는 로딩만, 에러·무권한이면 안내 후 리다이렉트 대기 (무한 로딩 방지)
  if (isMyInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-5 text-gray-500 font-medium">
        {isMyInfoError
          ? "정보를 불러오지 못했습니다."
          : "양식 수정 권한이 없습니다."}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !formDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-gray-500">양식 정보를 불러올 수 없습니다.</p>
        <button
          className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium cursor-pointer"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return <FormEditor formId={formId} formDetail={formDetail} />;
}
