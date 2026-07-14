"use client";
import { useRouter } from "next/navigation";
import { AiSummary } from "@repo/ui";
import {
  useAdminFormDetail,
  useAdminSubmitDetail,
  useAdminSubmitSummary,
} from "@/entities/from-management/api/query";
import { useGetProject } from "@/entities/project";
import {
  formatDeadlineDate,
  formatDeadlineTime,
  formatTimestamp,
} from "@/entities/form";
import FileAnswer from "@/entities/from-management/ui/Fileanswer";
import TextAnswer from "@/entities/from-management/ui/Textanswer";
import CalendarAnswer from "@/entities/from-management/ui/Calendaranswer";
import type { SubmitAnswer } from "@/entities/from-management/model/type";

type Props = { formId: number; submitId: number };

type AnswerItem = {
  fieldId: number;
  title: string;
  description: string;
  type: "TEXT" | "FILE" | "CALENDAR";
  orderIndex: number;
  answers: SubmitAnswer[];
};

function AnswerField({ item }: { item: AnswerItem }) {
  const answer = item.answers[0];

  return (
    <div className="flex flex-col py-6 px-6 sm:py-8 sm:px-12 border-t-5 border-yellow-600 bg-white rounded-[10px] shadow-new">
      <span className="text-[20px] font-semibold pb-2 text-gray-900">
        {item.title}
      </span>
      {item.description && (
        <span className="font-medium text-gray-500 pb-4">
          {item.description}
        </span>
      )}

      {item.type === "FILE" && <FileAnswer answer={answer} />}
      {item.type === "TEXT" && <TextAnswer answer={answer} />}
      {item.type === "CALENDAR" && <CalendarAnswer answers={item.answers} />}
    </div>
  );
}

export default function FormDetailView({ formId, submitId }: Props) {
  const router = useRouter();
  const { data: submissions, isLoading: submitLoading } =
    useAdminSubmitDetail(formId);

  const submission = submissions?.find((s) => s.submitId === submitId);

  const { data: formDetail, isLoading: formLoading } =
    useAdminFormDetail(formId);

  // 팀원 중 실제 제출자 이름을 표시하기 위해 프로젝트 상세(멤버 목록)를 조회한다.
  const { data: project } = useGetProject(submission?.projectId ?? NaN);
  const submitterName = project?.members.find(
    (m) => m.userId === submission?.submittedByUserId,
  )?.name;
  // 제출 답변 AI 요약 (제출 상세 진입 시 자동 조회)
  const { data: summary } = useAdminSubmitSummary(submitId);

  // 제출 답변을 fieldId로 묶고, 양식 조회 결과(설명·정렬)는 보강용으로만 사용한다.
  // 두 엔드포인트의 fieldId가 어긋나도 제출된 답변은 그대로 표시된다.
  const fieldMetaById = new Map(formDetail?.fields.map((f) => [f.id, f]) ?? []);
  const grouped = new Map<number, SubmitAnswer[]>();
  for (const a of submission?.answers ?? []) {
    const list = grouped.get(a.fieldId) ?? [];
    list.push(a);
    grouped.set(a.fieldId, list);
  }

  const items: AnswerItem[] = [...grouped.entries()]
    .map(([fieldId, answers]) => {
      const meta = fieldMetaById.get(fieldId);
      const type = (meta?.type ?? answers[0].type) as AnswerItem["type"];
      return {
        fieldId,
        title: meta?.title ?? answers[0].fieldTitle,
        description: meta?.description ?? "",
        type,
        orderIndex: meta?.orderIndex ?? Number.MAX_SAFE_INTEGER,
        answers,
      };
    })
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4 sm:px-8 bg-background">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 w-fit self-start mb-4 text-lg font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        ← 뒤로
      </button>

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
          <div className="flex flex-col">
            <span className="mb-2 text-center text-[24px] font-semibold text-gray-900">
              {formDetail.title}
            </span>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-gray-900">
                  마감 날짜: {formatDeadlineDate(formDetail.deadline)}
                  {formatDeadlineTime(formDetail.deadline) &&
                    ` · 마감 시간: ${formatDeadlineTime(formDetail.deadline)}`}
                </span>
                {submission && (
                  <span className="text-[14px] font-medium text-gray-500">
                    제출일: {formatTimestamp(submission.submittedAt)}
                  </span>
                )}
              </div>
              {submission && (
                <div className="flex flex-col items-end">
                  <span className="text-[24px] font-medium text-gray-900">
                    {submission.teamName}
                  </span>
                  {submitterName && (
                    <span className="text-[14px] font-medium text-gray-500">
                      제출자: {submitterName}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {submission && summary && <AiSummary summary={summary} />}

          <div className="flex flex-col gap-4 mb-20">
            {items.length === 0 ? (
              <div className="flex w-full justify-center pt-10 text-gray-500 font-medium">
                제출된 답변이 없습니다.
              </div>
            ) : (
              items.map((item) => (
                <AnswerField key={item.fieldId} item={item} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
