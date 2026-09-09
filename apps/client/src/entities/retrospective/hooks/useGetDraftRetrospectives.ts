// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useMemo } from "react";

import { useRetrospectiveStore } from "./useRetrospectiveStore";

export function useGetDraftRetrospectives() {
  const { drafts } = useRetrospectiveStore();

  // 최근에 임시 저장한 글이 위로 오도록 정렬한다
  const data = useMemo(
    () => [...drafts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [drafts],
  );

  return { data, isLoading: false as const, isError: false as const };
}
