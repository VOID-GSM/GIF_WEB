// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useCallback, useState } from "react";

import { deleteDraftRetrospective } from "../model/store";

interface MutateOptions {
  onSuccess?: () => void;
}

export function useDeleteDraftRetrospective() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback((id: number, options?: MutateOptions) => {
    setIsPending(true);
    deleteDraftRetrospective(id);
    setIsPending(false);
    options?.onSuccess?.();
  }, []);

  return { mutate, isPending };
}
