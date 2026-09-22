"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useGetRetrospectives,
  type RetrospectiveCategoryFilter,
  type RetrospectiveSort,
} from "@/entities/retrospective";
import RetrospectiveCard from "@/widgets/retrospective/ui/RetrospectiveCard";
import RetrospectiveFilterBar from "@/widgets/retrospective/ui/RetrospectiveFilterBar";

export default function RetrospectiveListView() {
  const router = useRouter();
  const [category, setCategory] = useState<RetrospectiveCategoryFilter>("ALL");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<RetrospectiveSort>("LATEST");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [mineOnly, setMineOnly] = useState(false);

  const { data, isLoading } = useGetRetrospectives({
    category,
    keyword,
    sort,
    bookmarkedOnly,
    mineOnly,
  });

  return (
    <div className="flex h-dvh w-full justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-[960px] flex-col">
        {/* 헤더 */}
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
              회고록
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              프로젝트와 개발 경험을 기록해보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/retrospective/write")}
            className="shrink-0 cursor-pointer rounded-[10px] bg-yellow-600 px-4 py-2 text-[13px] font-medium text-gray-900 transition-all duration-150 hover:-translate-y-0.5 hover:bg-yellow-700 hover:shadow active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            새 회고록 작성
          </button>
        </div>

        {/* 필터 */}
        <div className="mt-5 shrink-0">
          <RetrospectiveFilterBar
            category={category}
            onCategoryChange={setCategory}
            keyword={keyword}
            onKeywordChange={setKeyword}
            sort={sort}
            onSortChange={setSort}
            bookmarkedOnly={bookmarkedOnly}
            onBookmarkedOnlyChange={setBookmarkedOnly}
            mineOnly={mineOnly}
            onMineOnlyChange={setMineOnly}
          />
        </div>

        {/* 목록 — 이 영역만 스크롤된다 */}
        <div className="thin-scrollbar -mx-1 mt-3 flex-1 overflow-y-auto px-1 pt-2">
          {isLoading ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              불러오는 중
            </p>
          ) : data.length === 0 ? (
            <p className="py-16 text-center text-[13px] font-medium text-gray-400">
              {mineOnly
                ? "내가 작성한 회고록이 없습니다"
                : bookmarkedOnly
                  ? "북마크한 회고록이 없습니다"
                  : "검색 결과가 없습니다"}
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((retrospective, index) => (
                <li key={retrospective.id}>
                  <RetrospectiveCard
                    retrospective={retrospective}
                    animationDelayMs={(index % 6) * 40}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
