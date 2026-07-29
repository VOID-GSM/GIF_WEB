"use client";

import { useRouter } from "next/navigation";
import { Chevron, Markdown } from "@repo/ui";

import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useGetNoticeDetail } from "@/entities/notice";
import NoticeTargetBadges from "./NoticeTargetBadges";

interface NoticeDetailViewProps {
  noticeId: number;
}

export default function NoticeDetailView({ noticeId }: NoticeDetailViewProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetNoticeDetail(noticeId);

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push("/notice")}
          className="group -ml-1 flex items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          공지사항
        </button>

        {isPending ? (
          <p className="py-16 text-center text-[13px] font-medium text-gray-400">
            불러오는 중
          </p>
        ) : isError || !data ? (
          <p className="py-16 text-center text-[13px] font-medium text-red-500">
            공지 내용을 불러오지 못했습니다.
          </p>
        ) : (
          <>
            {/* 헤더 */}
            <div className="mt-2.5 border-b border-gray-200 pb-4">
              <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
                {data.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <NoticeTargetBadges
                  targetGrades={data.targetGrades}
                  targetTeamNames={data.targetTeamNames}
                />
                <span className="text-[12px] text-gray-400">
                  {formatTimestamp(data.createdAt)}
                </span>
              </div>
            </div>

            {/* 내용 */}
            <div className="mt-5 rounded-[10px] border border-gray-200 bg-white px-3.5 py-3">
              <Markdown content={data.content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
