import Link from "next/link";

import {
  CATEGORY_COLOR,
  CATEGORY_LABELS,
  type ListRetrospectiveResponse,
} from "@/entities/retrospective";

interface RetrospectiveCardProps {
  retrospective: ListRetrospectiveResponse;
  /** 목록 진입 시 카드가 순서대로 살짝 떠오르도록 지연 시간을 준다 */
  animationDelayMs?: number;
}

export default function RetrospectiveCard({
  retrospective,
  animationDelayMs = 0,
}: RetrospectiveCardProps) {
  const {
    title,
    summary,
    category,
    visibility,
    grade,
    projectId,
    teamName,
    tags,
    authorName,
    bookmarkCount,
    isBookmarked,
    createdAt,
  } = retrospective;

  return (
    <article
      style={{ animationDelay: `${animationDelayMs}ms` }}
      className="animate-fade-in-up flex h-full flex-col gap-3 rounded-[12px] border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-yellow-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
    >
      <Link
        href={`/retrospective/${retrospective.id}`}
        className="flex flex-1 cursor-pointer flex-col gap-3"
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLOR[category]}`}
          >
            {CATEGORY_LABELS[category]}
          </span>
          {visibility === "PRIVATE" && (
            <span className="shrink-0 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
              비공개
            </span>
          )}
        </div>

        <h2 className="line-clamp-2 text-[15px] font-semibold tracking-[-0.2px] text-gray-900">
          {title || "제목 없음"}
        </h2>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-gray-500">
          {summary || "내용이 아직 없습니다."}
        </p>
      </Link>

      <div className="flex items-end justify-between gap-3 pt-1">
        <div className="min-w-0 text-[12px] text-gray-400">
          <p className="truncate">
            {authorName} · {grade}학년 · {createdAt.slice(0, 10)}
          </p>
          {teamName && projectId !== undefined && (
            <Link
              href={`/projects/${projectId}`}
              className="mt-1 block w-fit max-w-full cursor-pointer truncate text-[12px] font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-yellow-700 hover:decoration-yellow-600"
            >
              {teamName}
            </Link>
          )}
          {!!tags?.length && (
            <p className="mt-1 truncate text-[11px] font-medium text-yellow-700">
              {tags.map((tag) => `#${tag}`).join(" ")}
            </p>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[12px] text-gray-400">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4h12v16l-6-4-6 4V4z" />
          </svg>
          {bookmarkCount}
        </span>
      </div>
    </article>
  );
}
