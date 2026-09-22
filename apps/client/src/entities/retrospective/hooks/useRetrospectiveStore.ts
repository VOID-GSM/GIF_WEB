// TODO(backend): 실제 API 연동 시 이 훅의 내부 구현만 TanStack Query로 교체 (컴포넌트 사용부는 변경 불필요)
"use client";

import { useSyncExternalStore } from "react";

import { getSnapshot, subscribe } from "../model/store";

/** 모듈 레벨 목 스토어를 구독한다 (세션 동안 작성한 글이 목록에 반영되도록) */
export function useRetrospectiveStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
