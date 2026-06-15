"use client";
import {
  useFormDetail,
  useAdminSubmitDetail,
} from "@/entities/from-management/api/query";
import FileAnswer from "@/entities/from-management/ui/Fileanswer";
import TextAnswer from "@/entities/from-management/ui/Textanswer";
import CalendarAnswer from "@/entities/from-management/ui/Calendaranswer";
import { SubmitAnswer, FormField } from "@/entities/from-management/model/type";

type Props = { formId: number };

function AnswerField({
  field,
  answer,
}: {
  field: FormField;
  answer: SubmitAnswer | undefined;
}) {
  return (
    <div className="flex flex-col py-8 px-12 border-t-5 border-yellow-600 bg-white rounded-[10px]">
      <span className="text-[20px] font-semibold pb-2">{field.title}</span>
      <span className="font-medium text-gray-500 pb-4">
        {field.description}
      </span>

      {field.type === "file" && <FileAnswer answer={answer} />}
      {field.type === "text" && <TextAnswer answer={answer} />}
      {field.type === "calendar" && <CalendarAnswer answer={answer} />}
    </div>
  );
}

export default function FormDetailView({ formId }: Props) {
  const { data: formDetail, isLoading: formLoading } = useFormDetail(formId);
  const { data: submitDetail, isLoading: submitLoading } =
    useAdminSubmitDetail(formId); // teamId → formId

  const submission = submitDetail?.[0];

  if (formLoading || submitLoading) return <div>로딩중...</div>;
  if (!formDetail) return <div>양식 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center pt-40 bg-background">
      <div className="mx-auto flex flex-col w-full max-w-[560px] gap-6">
        <div className="flex flex-col gap-2">
          <span className="flex justify-center text-[24px] font-semibold">
            {formDetail.title}
          </span>
          <span className="text-[14px] font-medium">
            마감일: {formDetail.deadline}
          </span>
          <div className="flex gap-8 border-l-4 border-yellow-400 bg-yellow-50 px-8 py-[10px] text-5 font-semibold">
            AI 요약
            <span className="text-4 font-medium text-gray-700">
              {/* {submission?.aiSummary} */}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-20">
          {formDetail.fields
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((field) => {
              const answer = submission?.answers.find(
                (a) => a.fieldId === field.id,
              );
              return (
                <AnswerField key={field.id} field={field} answer={answer} />
              );
            })}
        </div>
      </div>
    </div>
  );
}
