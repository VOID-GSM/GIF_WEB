"use client";

import Link from "next/link";
import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useGetMyInquiries } from "@/entities/inquiry";
import type { InquiryStatus } from "@/entities/inquiry";
import InquiryTabs from "./InquiryTabs";

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

export default function MyInquiryListView() {
  const { data, isPending, isError } = useGetMyInquiries();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[600px]">
        <InquiryTabs />

        {/* 헤더 */}
        <div className="mt-2.5 border-b border-gray-200 pb-4">
          <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
            내 문의 내역
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
            지금까지 남긴 문의와 답변 상태를 확인할 수 있습니다.
          </p>
        </div>

        {/* 목록 */}
        <div className="mt-5">
          {isPending ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              불러오는 중
            </p>
          ) : isError ? (
            <p className="py-16 text-center text-[13px] font-medium text-red-500">
              문의 내역을 불러오지 못했습니다.
            </p>
          ) : !data || data.length === 0 ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              문의 내역이 없습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {data.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/inquiry/my/${inquiry.id}`}
                    className="group flex w-full items-center justify-between gap-3 rounded-[12px] border border-gray-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-yellow-600 hover:bg-yellow-50"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-[14px] font-medium text-gray-800">
                        {inquiry.title}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {formatTimestamp(inquiry.createdAt)}
                      </span>
                    </div>
                    <StatusPill status={inquiry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
