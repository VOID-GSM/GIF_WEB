import { SubmitAnswer } from "@/entities/from-management/model/type";

export default function TextAnswer({
  answer,
}: {
  answer: SubmitAnswer | undefined;
}) {
  return (
    <div className="min-h-20 w-full break-words whitespace-pre-wrap border border-gray-80 rounded-[10px] p-[15px] font-medium text-gray-900">
      {answer?.textAnswer ?? "답변 없음"}
    </div>
  );
}
