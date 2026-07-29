"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chevron, Markdown } from "@repo/ui";

import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useDeleteNotice, useGetNoticeDetail } from "@/entities/notice";
import NoticeTargetBadges from "./NoticeTargetBadges";

interface NoticeDetailViewProps {
  noticeId: number;
}

export default function NoticeDetailView({ noticeId }: NoticeDetailViewProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetNoticeDetail(noticeId);
  const { mutate: removeNotice, isPending: isDeleting } = useDeleteNotice();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDelete = () => {
    if (isDeleting) return;
    removeNotice(noticeId, {
      onSuccess: () => router.push("/notice"),
    });
  };

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

            {/* 액션 */}
            <div className="mt-6 flex items-center justify-end gap-2">
              {isConfirmingDelete ? (
                <>
                  <span className="mr-auto text-[13px] font-medium text-gray-500">
                    이 공지를 삭제할까요?
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    disabled={isDeleting}
                    className="h-10 cursor-pointer rounded-[10px] px-4 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-10 cursor-pointer rounded-[10px] bg-red-500 px-5 text-[13px] font-semibold text-white transition-all hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:active:scale-100"
                  >
                    {isDeleting ? "삭제 중..." : "삭제하기"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="h-10 cursor-pointer rounded-[10px] border border-gray-200 px-4 text-[13px] font-medium text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  삭제
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
