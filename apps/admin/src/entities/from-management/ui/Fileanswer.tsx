import { SubmitAnswer } from "@/entities/from-management/model/type";
import { File } from "@repo/ui";

export default function FileAnswer({
  answer,
}: {
  answer: SubmitAnswer | undefined;
}) {
  const fileName = answer?.filePath?.split("/").pop() ?? "";

  if (!answer?.filePath) {
    return <span className="text-gray-400">파일 없음</span>;
  }

  return (
    <a
      href={answer.filePath}
      download
      className="flex items-center justify-between rounded-[10px] border border-gray-80 pl-[24px] pr-[30px] py-[15px]"
    >
      <div className="flex gap-[22px]">
        <File />
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold">{fileName}</span>
          <span className="text-[11px] text-gray-400">
            {answer.fileSize
              ? `${(answer.fileSize / 1024 / 1024).toFixed(1)}MB`
              : ""}
          </span>
        </div>
      </div>
    </a>
  );
}
