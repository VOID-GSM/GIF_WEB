"use client";

import { useTranslations } from "next-intl";
import {
  CATEGORY_FILTER_VALUES,
  SORT_VALUES,
  type RetrospectiveCategoryFilter,
  type RetrospectiveSort,
} from "@/entities/retrospective";
import CustomSelect from "@/shared/ui/CustomSelect";

interface RetrospectiveFilterBarProps {
  category: RetrospectiveCategoryFilter;
  onCategoryChange: (category: RetrospectiveCategoryFilter) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  sort: RetrospectiveSort;
  onSortChange: (sort: RetrospectiveSort) => void;
  bookmarkedOnly: boolean;
  onBookmarkedOnlyChange: (bookmarkedOnly: boolean) => void;
  mineOnly: boolean;
  onMineOnlyChange: (mineOnly: boolean) => void;
}

export default function RetrospectiveFilterBar({
  category,
  onCategoryChange,
  keyword,
  onKeywordChange,
  sort,
  onSortChange,
  bookmarkedOnly,
  onBookmarkedOnlyChange,
  mineOnly,
  onMineOnlyChange,
}: RetrospectiveFilterBarProps) {
  const t = useTranslations("retrospective.filter");
  const tr = useTranslations("retrospective");
  const sortOptions = SORT_VALUES.map((value) => ({
    value,
    label: tr(`sort.${value}`),
  }));
  return (
    <div className="flex flex-col gap-3">
      {/* 카테고리 필터 */}
      <div
        role="group"
        aria-label={t("categoryLabel")}
        className="flex flex-wrap gap-1.5"
      >
        {CATEGORY_FILTER_VALUES.map((value) => {
          const isActive = value === category;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(value)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-150 hover:scale-105 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 ${
                isActive
                  ? "border-yellow-600 bg-yellow-50 text-yellow-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tr(`category.${value}`)}
            </button>
          );
        })}
      </div>

      {/* 검색 · 정렬 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label htmlFor="retrospective-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <input
            id="retrospective-search"
            type="search"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-black outline-none transition-colors placeholder:text-gray-400 focus:border-yellow-600"
          />
        </div>

        <div className="shrink-0 sm:w-[130px]">
          <label htmlFor="retrospective-sort" className="sr-only">
            {t("sortLabel")}
          </label>
          <CustomSelect
            id="retrospective-sort"
            value={sort}
            options={sortOptions}
            onChange={onSortChange}
            ariaLabel={t("sortLabel")}
            size="lg"
          />
        </div>

        <button
          type="button"
          aria-pressed={bookmarkedOnly}
          onClick={() => onBookmarkedOnlyChange(!bookmarkedOnly)}
          className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-[13px] font-medium transition-all duration-150 hover:scale-105 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 ${
            bookmarkedOnly
              ? "border-yellow-600 bg-yellow-50 text-yellow-700"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill={bookmarkedOnly ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4h12v16l-6-4-6 4V4z" />
          </svg>
          {t("bookmarkedOnly")}
        </button>

        <button
          type="button"
          aria-pressed={mineOnly}
          onClick={() => onMineOnlyChange(!mineOnly)}
          className={`shrink-0 cursor-pointer rounded-[10px] border px-3 py-2.5 text-[13px] font-medium transition-all duration-150 hover:scale-105 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 ${
            mineOnly
              ? "border-yellow-600 bg-yellow-50 text-yellow-700"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          {t("mineOnly")}
        </button>
      </div>
    </div>
  );
}
