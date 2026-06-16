"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminForms } from "@/entities/from-management/api/query";

export default function FormSubmissionsView() {
  const [selectedGrade, setSelectedGrade] = useState<1 | 2>(1);
  const { data, isLoading } = useAdminForms();
  const router = useRouter();
  const filtered = data?.filter((form) => form.targetGrade === selectedGrade);

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen flex flex-col pt-40 bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-5 rounded-[32px] bg-white p-2 shadow-new">
          <button
            onClick={() => setSelectedGrade(1)}
            className={`flex rounded-[32px] py-2 px-[38px] text-5 font-medium border cursor-pointer ${
              selectedGrade === 1
                ? "border-yellow-400 bg-yellow-50"
                : "border-white"
            }`}
          >
            1학년
          </button>

          <button
            onClick={() => setSelectedGrade(2)}
            className={`flex rounded-[32px] py-2 px-[38px] text-5 font-medium border cursor-pointer ${
              selectedGrade === 2
                ? "border-yellow-400 bg-yellow-50"
                : "border-white"
            }`}
          >
            2학년
          </button>
        </div>

        {filtered?.map((form) => (
          <div
            key={form.id}
            className={`flex items-center justify-between h-20 w-200 pl-8 pr-17 bg-white rounded-[12px] shadow 
              ${form.submitted ? "cursor-pointer" : "cursor-not-allowed"}`}
            onClick={() => {
              if (!form.submitted) return;
              router.push(`/form/submissions/${form.id}`);
            }}
          >
            <div className="flex gap-8 text-5 font-medium">
              <span>{form.teamName}</span>
              <span>{form.title}</span>
            </div>

            <div className="flex items-center gap-16 text-5 font-medium">
              <span>{form.deadline}</span>
              <span
                className={`flex items-center justify-center w-20 py-[5px] border rounded-[12px] text-4 ${
                  form.submitted
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                {form.submitted ? "제출" : "미제출"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
