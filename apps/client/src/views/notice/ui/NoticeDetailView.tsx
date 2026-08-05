"use client";

import { useRouter } from "next/navigation";
import { Chevron, Markdown } from "@repo/ui";

import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import {
  isNoticeVisible,
  useGetNoticeDetail,
  useNoticeViewer,
} from "@/entities/notice";
import NoticeTargetBadges from "./NoticeTargetBadges";

interface NoticeDetailViewProps {
  noticeId: number;
}

export default function NoticeDetailView({ noticeId }: NoticeDetailViewProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetNoticeDetail(noticeId);
  const { viewer, isPending: isViewerPending } = useNoticeViewer();

  // 목록·배너에서 걸러도 URL로 직접 들어오면 열리므로 상세에서도 대상을 확인한다.
  const isBlocked = !!data && !isNoticeVisible(data, viewer);

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

        {isPending || isViewerPending ? (
          <p className="py-16 text-center text-[13px] font-medium text-gray-400">
            불러오는 중
          </p>
        ) : isError || !data ? (
          <p className="py-16 text-center text-[13px] font-medium text-red-500">
            공지 내용을 불러오지 못했습니다.
          </p>
        ) : isBlocked ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-[13px] font-medium text-gray-400">
              내 학년·팀이 대상이 아닌 공지입니다.
            </p>
            <button
              type="button"
              onClick={() => router.push("/notice")}
              className="cursor-pointer text-[13px] font-medium text-gray-600 underline underline-offset-2 transition-colors hover:text-gray-800"
            >
              공지사항 목록으로
            </button>
          </div>
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

            {/* 내용 — 배경 없이 본문 그대로 흐르게 둔다 */}
            <div className="mt-5">
              <Markdown content={data.content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
