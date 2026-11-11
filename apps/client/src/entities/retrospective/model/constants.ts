import type {
  RetrospectiveAiAction,
  RetrospectiveCategory,
  RetrospectiveCategoryFilter,
  RetrospectiveSort,
} from "./type";

// 카테고리·정렬 라벨은 번역 리소스(retrospective.category / retrospective.sort)에 있다.
export const CATEGORY_ORDER: RetrospectiveCategory[] = [
  "FEATURE",
  "IMPROVEMENT",
  "REFACTORING",
  "TROUBLESHOOTING",
  "RETROSPECT",
  "PORTFOLIO",
];

/** 목록 필터 pill 용 — 맨 앞에 "전체"를 둔다 */
export const CATEGORY_FILTER_VALUES: RetrospectiveCategoryFilter[] = [
  "ALL",
  ...CATEGORY_ORDER,
];

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

export const SORT_VALUES: RetrospectiveSort[] = ["LATEST", "OLDEST", "BOOKMARK"];

/** AI 도움받기 요청 제한 (서버 검증 기준과 같다) */
export const AI_ASSIST_MAX_CONTENT_LENGTH = 5000;
export const AI_ASSIST_MIN_CONTENT_LENGTH = 20;
export const AI_ASSIST_MAX_TITLE_LENGTH = 100;

/** 다듬기·포트폴리오 변환은 본문이 최소 길이 이상이어야 한다 (구조 추천은 빈 본문도 가능) */
export const aiActionNeedsMinContent = (action: RetrospectiveAiAction) =>
  action === "polish" || action === "portfolio";

/** 공백을 뺀 본문 길이가 부족해 이 기능을 쓸 수 없는지 */
export const isAiContentTooShort = (action: RetrospectiveAiAction, content: string) =>
  aiActionNeedsMinContent(action) &&
  content.trim().length < AI_ASSIST_MIN_CONTENT_LENGTH;
