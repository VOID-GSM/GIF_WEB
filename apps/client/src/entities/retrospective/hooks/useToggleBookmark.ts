// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useCallback, useState } from "react";

import { toggleBookmark } from "../model/store";
import type { DetailRetrospectiveResponse } from "../model/type";

interface MutateOptions {
  onSuccess?: (data: DetailRetrospectiveResponse) => void;
}

export function useToggleBookmark() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback((id: number, options?: MutateOptions) => {
    setIsPending(true);
    const updated = toggleBookmark(id);
    setIsPending(false);
    if (updated) options?.onSuccess?.(updated);
  }, []);

  return { mutate, isPending };
}
