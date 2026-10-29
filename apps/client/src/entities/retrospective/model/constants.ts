import type {
  RetrospectiveCategory,
  RetrospectiveCategoryFilter,
  RetrospectiveSort,
} from "./type";

export const CATEGORY_LABELS: Record<RetrospectiveCategory, string> = {
  FEATURE: "기능 개발",
  IMPROVEMENT: "기능 개선",
  REFACTORING: "리팩토링",
  TROUBLESHOOTING: "트러블슈팅",
  RETROSPECT: "회고",
  PORTFOLIO: "포트폴리오",
};

export const CATEGORY_ORDER: RetrospectiveCategory[] = [
  "FEATURE",
  "IMPROVEMENT",
  "REFACTORING",
  "TROUBLESHOOTING",
  "RETROSPECT",
  "PORTFOLIO",
];

/** 작성 페이지의 기록 유형 select 용 — "전체"를 포함하지 않는다 */
export const CATEGORY_OPTIONS: {
  value: RetrospectiveCategory;
  label: string;
}[] = CATEGORY_ORDER.map((value) => ({ value, label: CATEGORY_LABELS[value] }));

/** 목록 필터 pill 용 — 맨 앞에 "전체"를 둔다 */
export const CATEGORY_FILTER_OPTIONS: {
  value: RetrospectiveCategoryFilter;
  label: string;
}[] = [{ value: "ALL", label: "전체" }, ...CATEGORY_OPTIONS];

/**
 * 카테고리 태그 pill 색상.
 * 채도를 낮춘 회색빛 파스텔 배경 + 검정 텍스트로 통일한다 (색으로만 카테고리를 구분하고,
 * 텍스트는 항상 gray-900 — 다크모드에서는 tokens.css 전역 규칙으로 자동 반전된다).
 * 라이트 모드는 Tailwind 기본 팔레트(-50/-100)보다도 더 무채색에 가깝게, 임의값으로
 * 직접 채도를 낮춘 색을 쓴다.
 */
export const CATEGORY_COLOR: Record<RetrospectiveCategory, string> = {
  FEATURE:
    "border-[#c7d4e3] bg-[#e6ecf4] text-gray-900 dark:border-blue-900 dark:bg-blue-950/40",
  IMPROVEMENT:
    "border-[#c6dcc0] bg-[#e6efe3] text-gray-900 dark:border-green-900 dark:bg-green-950/40",
  REFACTORING:
    "border-[#d2c0e3] bg-[#ece4f3] text-gray-900 dark:border-purple-900 dark:bg-purple-950/40",
  TROUBLESHOOTING:
    "border-[#e0b8b8] bg-[#f4e2e2] text-gray-900 dark:border-red-900 dark:bg-red-950/40",
  RETROSPECT:
    "border-[#ddc98a] bg-[#f5eed7] text-gray-900 dark:border-yellow-800 dark:bg-yellow-950/40",
  PORTFOLIO:
    "border-gray-200 bg-gray-100 text-gray-900 dark:border-gray-600 dark:bg-gray-800",
};

export const SORT_OPTIONS: { value: RetrospectiveSort; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "BOOKMARK", label: "북마크순" },
];
