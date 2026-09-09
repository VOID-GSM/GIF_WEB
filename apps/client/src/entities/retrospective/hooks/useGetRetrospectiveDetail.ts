// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useMemo } from "react";

import { useMockLoading } from "./useMockLoading";
import { useRetrospectiveStore } from "./useRetrospectiveStore";

export function useGetRetrospectiveDetail(id: number | undefined) {
  const { retrospectives, drafts } = useRetrospectiveStore();
  const isLoading = useMockLoading();

  const data = useMemo(() => {
    if (id === undefined) return undefined;
    return [...retrospectives, ...drafts].find((item) => item.id === id);
  }, [retrospectives, drafts, id]);

  return { data, isLoading, isError: false as const };
}
