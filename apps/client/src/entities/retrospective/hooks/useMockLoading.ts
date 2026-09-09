// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useEffect, useState } from "react";

/** 실제 네트워크 대기와 비슷하게 짧은 로딩 상태를 흉내 낸다 */
export function useMockLoading(delay = 300) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
}
