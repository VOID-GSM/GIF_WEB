"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chevron } from "@repo/ui";
import { formatDeadline } from "@/entities/form/lib/formatDeadline";
import { useGetAdminInquiries } from "@/entities/inquiry";
import type { InquiryStatus } from "@/entities/inquiry";
import { useGetMyInfo } from "@/entities/mypage";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";

const PAGE_SIZE = 10;

const STATUS_META: Record<
  InquiryStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "답변 대기",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
  ANSWERED: {
    label: "답변 완료",
    className: "bg-yellow-50 text-yellow-700 border-yellow-600",
  },
};

function StatusPill({ status }: { status: InquiryStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export default function AdminInquiryListView() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data, isPending, isError } = useGetAdminInquiries({
    page,
    size: PAGE_SIZE,
  });

  // 문의 관리 페이지는 답변 권한 계정만 접근할 수 있다. 그 외 계정은 홈으로 돌려보낸다.
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  const isPermitted = myInfo?.email === PRIVILEGED_ADMIN_EMAIL;

  useEffect(() => {
    if (!isMyInfoLoading && !isPermitted) router.replace("/");
  }, [isMyInfoLoading, isPermitted, router]);

  if (isMyInfoLoading || !isPermitted) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] w-full items-center justify-center bg-background px-4 py-8">
        <p className="text-[13px] font-medium text-gray-400">불러오는 중</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="group -ml-1 flex items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          메인
        </button>

        {/* 헤더 */}
        <div className="mt-2.5 border-b border-gray-200 pb-4">
          <div className="flex items-end justify-between gap-3">
            <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
              문의 관리
            </h1>
            {data && (
              <span className="shrink-0 pb-0.5 text-[12px] font-medium text-gray-400">
                전체 {data.totalElements}건
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
            사용자가 남긴 문의를 확인하고 답변할 수 있습니다.
          </p>
        </div>

        {/* 목록 */}
        <div className="mt-5">
          {isPending ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              불러오는 중
            </p>
          ) : isError || !data ? (
            <p className="py-16 text-center text-[13px] font-medium text-red-500">
              문의 목록을 불러오지 못했습니다.
            </p>
          ) : data.content.length === 0 ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              등록된 문의가 없습니다.
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-2.5">
                {data.content.map((inquiry) => (
                  <li key={inquiry.id}>
                    <Link
                      href={`/inquiry/admin/${inquiry.id}`}
                      className="group flex w-full items-center justify-between gap-3 rounded-[12px] border border-gray-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-yellow-600 hover:bg-yellow-50"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate text-[14px] font-medium text-gray-800">
                          {inquiry.title}
                        </span>
                        <span className="text-[12px] text-gray-400">
                          {inquiry.createdByName} ·{" "}
                          {formatDeadline(inquiry.createdAt)}
                        </span>
                      </div>
                      <StatusPill status={inquiry.status} />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* 페이지네이션 */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={data.first}
                  className="h-9 cursor-pointer rounded-[10px] border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-600 transition-colors hover:border-yellow-600 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white"
                >
                  이전
                </button>
                <span className="text-[13px] font-medium text-gray-500">
                  {data.number + 1} / {Math.max(data.totalPages, 1)}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={data.last}
                  className="h-9 cursor-pointer rounded-[10px] border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-600 transition-colors hover:border-yellow-600 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white"
                >
                  다음
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
