"use client";

import { useRouter } from "next/navigation";
import { Chevron, File as FileIcon, Markdown } from "@repo/ui";
import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useGetMyInquiryDetail } from "@/entities/inquiry";
import type { InquiryStatus } from "@/entities/inquiry";

const STATUS_META: Record<
  InquiryStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "답변 대기",
    className:
      "bg-gray-100 text-gray-500 border-gray-200",
  },
  ANSWERED: {
    label: "답변 완료",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-600",
  },
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

interface MyInquiryDetailViewProps {
  inquiryId: number;
}

export default function MyInquiryDetailView({
  inquiryId,
}: MyInquiryDetailViewProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMyInquiryDetail(inquiryId);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push("/inquiry/my")}
          className="group -ml-1 flex items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          내 문의 내역
        </button>

        {isPending ? (
          <p className="py-16 text-center text-[13px] font-medium text-gray-400">
            불러오는 중
          </p>
        ) : isError || !data ? (
          <p className="py-16 text-center text-[13px] font-medium text-red-500">
            문의 내용을 불러오지 못했습니다.
          </p>
        ) : (
          <>
            {/* 헤더 */}
            <div className="mt-2.5 border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
                  {data.title}
                </h1>
                <span
                  className={`mt-1 shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[data.status].className}`}
                >
                  {STATUS_META[data.status].label}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-gray-400">
                {formatTimestamp(data.createdAt)}
              </p>
            </div>

            {/* 내용 */}
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-gray-700">
                  문의 내용
                </span>
                <div className="rounded-[10px] border border-gray-200 bg-white px-3.5 py-3">
                  <Markdown content={data.content} />
                </div>
              </div>

              {/* 첨부파일 */}
              {data.filePath && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-gray-700">
                    첨부파일
                  </span>
                  <div className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5">
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <FileIcon className="h-[18px] w-[15px] shrink-0" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-medium text-gray-700">
                          {data.originalFileName ??
                            data.filePath.split("/").pop() ??
                            "첨부파일"}
                        </span>
                        {typeof data.fileSize === "number" && (
                          <span className="text-[11px] text-gray-500">
                            {formatFileSize(data.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 답변 */}
              {data.status === "ANSWERED" && (
                <div className="mt-2 flex flex-col gap-1.5 rounded-[12px] border border-yellow-600 bg-yellow-50 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-yellow-700">
                      답변
                    </span>
                    {data.answeredAt && (
                      <span className="text-[11px] text-gray-500">
                        {formatTimestamp(data.answeredAt)}
                      </span>
                    )}
                  </div>
                  <Markdown content={data.answerContent ?? ""} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
