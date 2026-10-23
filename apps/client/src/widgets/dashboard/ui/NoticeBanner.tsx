"use client";

import Link from "next/link";

import { formatTimestamp } from "@/entities/form/lib/formatDeadline";
import { useVisibleNotices } from "@/entities/notice";

/** formatTimestamp의 "2026. 08. 05 02:24"에서 시각을 떼고 날짜만 남긴다. */
function formatDate(createdAt: string) {
  return formatTimestamp(createdAt).split(" ").slice(0, 3).join(" ");
}

/**
 * createdAt을 정렬용 숫자(ms)로 바꾼다.
 * 타입은 string이지만 서버가 null·숫자·배열([년, 월, 일, 시, 분, 초])로 내려주는 경우가 있어 모두 대응한다.
 */
function toTime(createdAt: unknown) {
  if (Array.isArray(createdAt)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] =
      createdAt.map(Number);
    return new Date(year, month - 1, day, hour, minute, second).getTime() || 0;
  }
  if (typeof createdAt !== "string" && typeof createdAt !== "number") return 0;
  return new Date(createdAt).getTime() || 0;
}

export default function NoticeBanner() {
  // 내 학년·팀이 대상인 공지만 대상으로 한다 (서버는 전체 목록을 내려준다)
  const { data } = useVisibleNotices();

  // 서버 응답의 정렬 순서를 보장할 수 없어 createdAt 기준 최신순으로 다시 정렬한다.
  const latestNotice = [...(data ?? [])].sort(
    (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
  )[0];

  // 로딩·에러·공지 없음 상태에서는 배너를 아예 띄우지 않는다 (빈 배너가 상단을 차지하지 않도록).
  if (!latestNotice) return null;

  return (
    // 아래쪽 음수 마진으로 부모의 flex gap(모바일 32px / 데스크톱 48px)을 24px로 맞춘다.
    <section className="-mb-2 flex w-full gap-3 min-[900px]:-mb-6">
      <span aria-hidden className="w-[3px] shrink-0 rounded-full bg-yellow-600" />

      <Link
        href={`/notice/${latestNotice.id}`}
        className="flex min-w-0 flex-1 flex-col gap-0.5"
      >
        <span className="text-[12px] text-gray-500">
          공지 · {formatDate(latestNotice.createdAt)}
        </span>
        <span className="truncate text-[15px] font-semibold text-gray-900">
          {latestNotice.title}
        </span>
      </Link>

      <Link
        href="/notice"
        className="shrink-0 self-center text-[12px] text-gray-500 transition-colors hover:text-gray-700"
      >
        전체 보기 ›
      </Link>
    </section>
  );
}
