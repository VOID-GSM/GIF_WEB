// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useCallback, useState } from "react";

import { upsertRetrospective } from "../model/store";
import type {
  DetailRetrospectiveResponse,
  UpsertRetrospectiveRequest,
} from "../model/type";

interface MutateOptions {
  onSuccess?: (data: DetailRetrospectiveResponse) => void;
}

export function useUpsertRetrospective() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    (payload: UpsertRetrospectiveRequest, options?: MutateOptions) => {
      setIsPending(true);
      const created = upsertRetrospective(payload);
      setIsPending(false);
      options?.onSuccess?.(created);
    },
    [],
  );

  return { mutate, isPending };
}
