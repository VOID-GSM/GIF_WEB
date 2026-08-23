"use client";

import { useRouter } from "next/navigation";
import { Plus } from "@repo/ui";

import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useGetNotices } from "@/entities/notice";
import NoticeTargetBadges from "./NoticeTargetBadges";

export default function NoticeListView() {
  const router = useRouter();
  const { data, isPending, isError } = useGetNotices();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        {/* 헤더 */}
        <div className="flex items-end justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
              공지사항
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              아이디어페스티벌 진행에 필요한 공지를 확인하고 등록할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/notice/create")}
            className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] bg-yellow-600 px-3.5 text-[13px] font-semibold text-gray-900 transition-all hover:bg-yellow-400 active:scale-[0.98]"
          >
            <Plus className="h-3 w-3" />
            공지 작성
          </button>
        </div>

        {/* 목록 */}
        <div className="mt-5">
          {isPending ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              불러오는 중
            </p>
          ) : isError ? (
            <p className="py-16 text-center text-[13px] font-medium text-red-500">
              공지사항을 불러오지 못했습니다.
            </p>
          ) : !data || data.length === 0 ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              등록된 공지가 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {data.map((notice) => (
                <li key={notice.id}>
                  <button
                    type="button"
                    onClick={() => router.push(`/notice/${notice.id}`)}
                    className="group flex w-full flex-col gap-2 rounded-[12px] border border-gray-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-yellow-600 hover:bg-yellow-50"
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <span className="truncate text-[14px] font-medium text-gray-800">
                        {notice.title}
                      </span>
                      <span className="shrink-0 text-[12px] text-gray-400">
                        {formatTimestamp(notice.createdAt)}
                      </span>
                    </div>
                    <NoticeTargetBadges
                      targetGrades={notice.targetGrades}
                      targetTeamNames={notice.targetTeamNames}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
