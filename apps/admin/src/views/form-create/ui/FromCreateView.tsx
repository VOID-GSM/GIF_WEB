"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormCard, Plus, DatePicker } from "@repo/ui";
import { toast } from "sonner";

import { usePostForm, useAnnounceForm } from "@/entities/form-create";
import type { PostFormRequestField } from "@/entities/form-create";
import { useGetMyInfo } from "@/entities/mypage";

type FieldType = "TEXT" | "FILE" | "CALENDAR" | "";

type FieldWithId = {
  id: string;
  title: string;
  description: string;
  type: FieldType;
  orderIndex: number;
};

export default function FormCreateView() {
  const router = useRouter();
  const { mutate: createForm, isPending: isSaving } = usePostForm();
  const { mutate: announce, isPending: isAnnouncing } = useAnnounceForm();

  // 양식 생성은 아이디어페스티벌 담당(MASTER)만 가능 — 그 외 역할·에러는 목록으로 돌려보낸다.
  const { data: myInfo, isLoading: isMyInfoLoading, isError } = useGetMyInfo();
  const canCreate = !isError && myInfo?.adminRole === "MASTER";

  useEffect(() => {
    // 로딩이 끝났는데(정보 도착 또는 에러) 권한이 없으면 목록으로 보낸다.
    if (!isMyInfoLoading && (myInfo || isError) && !canCreate) {
      toast.error("양식 생성 권한이 없습니다.");
      router.replace("/form");
    }
  }, [isMyInfoLoading, myInfo, isError, canCreate, router]);

  const [formTitle, setFormTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [savedFormId, setSavedFormId] = useState<number | null>(null);

  const [fields, setFields] = useState<FieldWithId[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      type: "TEXT",
      orderIndex: 0,
    },
  ]);

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        type: "",
        orderIndex: prev.length,
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

  const hasEmptyValue = () => {
    const isEmpty = (value: string) => value.trim() === "";

    return (
      isEmpty(formTitle) ||
      isEmpty(deadline) ||
      fields.some(
        (f) => isEmpty(f.title) || isEmpty(f.description) || f.type === "",
      )
    );
  };

  const handleSave = () => {
    if (hasEmptyValue()) {
      toast.error("입력하지 않은 값이 있어 저장할 수 없습니다.");
      return;
    }

    createForm(
      {
        title: formTitle,
        deadline,
        fields: fields.map(({ ...rest }) => rest as PostFormRequestField),
      },
      {
        onSuccess: (res) => {
          setSavedFormId(res.data);
          toast.success("양식이 저장되었습니다.");
        },
        onError: () => toast.error("양식 저장에 실패했습니다."),
      },
    );
  };

  const handleAnnounce = () => {
    if (hasEmptyValue()) {
      toast.error("입력하지 않은 값이 있어 공지할 수 없습니다.");
      return;
    }

    const doAnnounce = (formId: number) => {
      announce({ formId }, { onSuccess: () => router.push("/form") });
    };

    if (savedFormId) {
      doAnnounce(savedFormId);
    } else {
      createForm(
        {
          title: formTitle,
          deadline,
          fields: fields.map(({ ...rest }) => rest as PostFormRequestField),
        },
        {
          onSuccess: (res) => {
            setSavedFormId(res.data);
            doAnnounce(res.data);
          },
          onError: () => toast.error("양식 저장에 실패했습니다."),
        },
      );
    }
  };

  // 권한 확인 중에는 로딩만, 에러·무권한이면 안내 후 리다이렉트 대기 (무한 로딩 방지)
  if (isMyInfoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-5 text-gray-500 font-medium">
        불러오는 중...
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-5 text-gray-500 font-medium">
        {isError ? "정보를 불러오지 못했습니다." : "양식 생성 권한이 없습니다."}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-5">
      <span className="pt-20 pb-8 font-semibold text-[24px]">
        양식 생성하기
      </span>
      <div className="w-full max-w-[560px] flex flex-col pb-6 gap-4">
        <div className="flex flex-col text-[14px] font-medium text-gray-600 gap-1">
          제목 입력하기
          <input
            className="w-full py-3 px-4 border border-gray-200 rounded-[10px] text-[18px] font-medium placeholder:text-gray-500 text-black outline-none bg-white"
            placeholder="제목을 입력하세요"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
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

        <div className="w-full flex flex-col sm:flex-row gap-5 pb-20">
          <button
            className="flex w-full items-center justify-center py-3 font-medium border border-yellow-700 bg-white rounded-[10px] cursor-pointer disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            저장하기
          </button>
          <button
            className="flex w-full items-center justify-center py-3 font-medium bg-yellow-600 rounded-[10px] cursor-pointer disabled:opacity-50"
            onClick={handleAnnounce}
            disabled={isAnnouncing || isSaving}
          >
            공지하기
          </button>
        </div>
      </div>
    </div>
  );
}
