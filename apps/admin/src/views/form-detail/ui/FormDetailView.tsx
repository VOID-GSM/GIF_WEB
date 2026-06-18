"use client";
import { useGetFormById } from "@/entities/form-edit";
import { useAdminSubmitDetail } from "@/entities/from-management/api/query";
import FileAnswer from "@/entities/from-management/ui/Fileanswer";
import TextAnswer from "@/entities/from-management/ui/Textanswer";
import CalendarAnswer from "@/entities/from-management/ui/Calendaranswer";
import type { SubmitAnswer } from "@/entities/from-management/model/type";
import type { FormByIdField } from "@/entities/form-edit";

type Props = { formId: number; submitId: number };

function AnswerField({
  field,
  answers,
}: {
  field: FormByIdField;
  answers: SubmitAnswer[];
}) {
  const answer = answers[0];

  return (
    <div className="flex flex-col py-8 px-12 border-t-5 border-yellow-600 bg-white rounded-[10px] shadow-new">
      <span className="text-[20px] font-semibold pb-2">{field.title}</span>
      <span className="font-medium text-gray-500 pb-4">
        {field.description}
      </span>

      {field.type === "FILE" && <FileAnswer answer={answer} />}
      {field.type === "TEXT" && <TextAnswer answer={answer} />}
      {field.type === "DATE" && <CalendarAnswer answers={answers} />}
    </div>
  );
}

export default function FormDetailView({ formId, submitId }: Props) {
  const { data: submissions, isLoading: submitLoading } =
    useAdminSubmitDetail(formId);

  const submission = submissions?.find((s) => s.submitId === submitId);
  const projectId = submission?.projectId;

  const { data: formDetail, isLoading: formLoading } = useGetFormById(
    formId,
    projectId,
  );

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 bg-background">
      {formLoading || submitLoading ? (
        <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
          로딩중...
        </div>
      ) : !formDetail ? (
        <div className="flex w-full justify-center pt-20 text-gray-500 font-medium">
          양식 정보를 불러올 수 없습니다.
        </div>
      ) : (
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
              <span className="text-4 font-medium text-gray-700" />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-20">
            {[...formDetail.fields]
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((field) => {
                const answers =
                  submission?.answers.filter(
                    (a) => a.fieldId === field.fieldId,
                  ) ?? [];
                return (
                  <AnswerField
                    key={field.fieldId}
                    field={field}
                    answers={answers}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
