"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chevron, Markdown } from "@repo/ui";

import {
  CATEGORY_COLOR,
  CATEGORY_LABELS,
  useGetRetrospectiveDetail,
  useToggleBookmark,
} from "@/entities/retrospective";
import AiSummaryCard from "@/widgets/retrospective/ui/AiSummaryCard";
import RelatedWorkCard from "@/widgets/retrospective/ui/RelatedWorkCard";

interface RetrospectiveDetailViewProps {
  id: number;
}

export default function RetrospectiveDetailView({
  id,
}: RetrospectiveDetailViewProps) {
  const router = useRouter();
  const { data, isLoading } = useGetRetrospectiveDetail(id);
  const { mutate: toggleBookmark, isPending: isBookmarking } =
    useToggleBookmark();

  return (
    <div className="flex min-h-dvh w-full justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[720px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push("/retrospective")}
          className="group -ml-1 flex cursor-pointer items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          회고록
        </button>

        {isLoading ? (
          <p className="py-24 text-center text-[13px] font-medium text-gray-400">
            불러오는 중
          </p>
        ) : !data || data.isDraft ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-[14px] font-medium text-gray-500">
              존재하지 않거나 삭제된 회고록입니다.
            </p>
            <Link
              href="/retrospective"
              className="text-[13px] font-medium text-yellow-700 underline underline-offset-2 hover:text-yellow-800"
            >
              목록으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <div className="animate-fade-in-up mt-4 flex flex-col gap-3 border-b border-gray-200 pb-5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLOR[data.category]}`}
                >
                  {CATEGORY_LABELS[data.category]}
                </span>
                {data.visibility === "PRIVATE" && (
                  <span className="shrink-0 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    비공개
                  </span>
                )}
              </div>

              <h1 className="text-[20px] font-semibold tracking-[-0.3px] text-gray-900">
                {data.title || "제목 없음"}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] text-gray-400">
                  {data.authorName} · {data.grade}학년 · {data.part} ·{" "}
                  {data.createdAt.slice(0, 10)}
                </span>

                {data.teamName && data.projectId !== undefined && (
                  <Link
                    href={`/projects/${data.projectId}`}
                    className="text-[12px] font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-yellow-700 hover:decoration-yellow-600"
                  >
                    {data.teamName}
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => toggleBookmark(data.id)}
                  disabled={isBookmarking}
                  aria-pressed={data.isBookmarked}
                  aria-label={
                    data.isBookmarked ? "북마크 취소" : "북마크에 추가"
                  }
                  className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-all duration-150 hover:scale-105 active:brightness-95 disabled:cursor-not-allowed ${
                    data.isBookmarked
                      ? "border-yellow-600 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill={data.isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4h12v16l-6-4-6 4V4z" />
                  </svg>
                  {data.bookmarkCount}
                </button>
              </div>
            </div>

            {/* AI 요약 */}
            <div
              className="animate-fade-in-up mt-5"
              style={{ animationDelay: "20ms" }}
            >
              <AiSummaryCard content={data.content} />
            </div>

            {/* 본문 */}
            <div
              className="animate-fade-in-up mt-6"
              style={{ animationDelay: "40ms" }}
            >
              <Markdown content={data.content} className="text-[14px]" />
            </div>

            {/* 관련 작업 */}
            {data.relatedWorks.length > 0 && (
              <div
                className="animate-fade-in-up mt-8"
                style={{ animationDelay: "80ms" }}
              >
                <h2 className="text-[14px] font-semibold text-gray-900">
                  관련 작업
                </h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {data.relatedWorks.map((work) => (
                    <li
                      key={`${work.type}-${work.number}`}
                      className="w-full sm:w-[260px]"
                    >
                      <RelatedWorkCard work={work} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
