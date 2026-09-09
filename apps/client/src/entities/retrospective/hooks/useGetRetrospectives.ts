// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useMemo } from "react";

import type {
  ListRetrospectiveResponse,
  RetrospectiveQueryParams,
} from "../model/type";
import { useMockLoading } from "./useMockLoading";
import { useRetrospectiveStore } from "./useRetrospectiveStore";

export const RETROSPECTIVE_QUERY_KEY = ["retrospective"];

export function useGetRetrospectives(params: RetrospectiveQueryParams = {}) {
  const {
    category = "ALL",
    keyword = "",
    sort = "LATEST",
    bookmarkedOnly = false,
  } = params;
  const { retrospectives } = useRetrospectiveStore();
  const isLoading = useMockLoading();

  const data = useMemo<ListRetrospectiveResponse[]>(() => {
    const normalized = keyword.trim().toLowerCase();

    const filtered = retrospectives.filter((item) => {
      if (bookmarkedOnly && !item.isBookmarked) return false;
      if (category !== "ALL" && item.category !== category) return false;
      if (!normalized) return true;

      return (
        item.title.toLowerCase().includes(normalized) ||
        item.summary.toLowerCase().includes(normalized) ||
        item.content.toLowerCase().includes(normalized)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sort === "BOOKMARK") return b.bookmarkCount - a.bookmarkCount;
      if (sort === "OLDEST") return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [retrospectives, category, keyword, sort, bookmarkedOnly]);

  return { data, isLoading, isError: false as const };
}
