"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormCard, Plus, DatePicker } from "@repo/ui";
import { usePostForm, useAnnounceForm } from "@/entities/form-create";
import type { PostFormRequestField } from "@/entities/form-create";

type FieldWithId = PostFormRequestField & { id: string };

export default function FormCreateView() {
  const router = useRouter();
  const { mutate: createForm, isPending: isSaving } = usePostForm();
  const { mutate: announce, isPending: isAnnouncing } = useAnnounceForm();

  const [formTitle, setFormTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [targetGrade, setTargetGrade] = useState<1 | 2>(1);

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
        type: "TEXT",
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

  const handleSave = () => {
    createForm(
      {
        title: formTitle,
        description,
        deadline,
        targetGrade,
        fields: fields.map(({ id, ...rest }) => rest),
      },
      {
        onSuccess: (res) => {
          setSavedFormId(res.data);
          console.log("저장 성공");
        },

        onError: (error) => {
          console.error("저장 실패", error);
        },
      },
    );
  };

  const handleAnnounce = () => {
    if (!savedFormId) {
      console.error("저장 필요!");
      return;
    }
    announce(
      { formId: savedFormId },
      {
        onSuccess: () => {
          router.push("/");
        },

        onError: (error) => {
          console.error("공지 실패", error);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 bg-background">
      <span className="pt-20 pb-8 font-semibold text-[24px]">
        양식 생성하기
      </span>

      <div className="w-[560px] flex flex-col pb-6 gap-4">
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
          설명 입력하기
          <input
            className="w-full py-3 px-4 border border-gray-200 rounded-[10px] text-[16px] font-medium placeholder:text-gray-500 text-black outline-none bg-white"
            placeholder="양식 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-[14px] font-medium text-gray-600 gap-1">
          대상 학년 선택하기
          <div className="flex gap-3">
            {([1, 2] as const).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setTargetGrade(grade)}
                className={`flex-1 py-3 rounded-[10px] font-medium border cursor-pointer ${
                  targetGrade === grade
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {grade}학년
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col text-[14px] font-medium text-gray-600 gap-1">
          마감일 선택하기
          <div>
            <DatePicker value={deadline} onChange={setDeadline} />
          </div>
        </div>
      </div>

      <div className="w-[560px] flex flex-col gap-5">
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

        <div className="w-full flex gap-5 pb-20">
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
            disabled={isAnnouncing}
          >
            공지하기
          </button>
        </div>
      </div>
    </div>
  );
}
