"use client";

import { useCallback, useSyncExternalStore } from "react";

import { GRADES, type Grade } from "../model/types";

const DEFAULT_GRADE_STORAGE_KEY = "projectListGrade";

function parseGrade(value: string | null): Grade {
  const parsed = Number(value);
  return (GRADES as readonly number[]).includes(parsed)
    ? (parsed as Grade)
    : GRADES[0];
}

// storageKey별로 리스너를 분리해, 한 화면의 학년 변경이 다른 키를 쓰는 화면까지
// 리렌더링시키지 않도록 한다.
const listenersMap = new Map<string, Set<() => void>>();

function notify(storageKey: string) {
  listenersMap.get(storageKey)?.forEach((listener) => listener());
}

function getServerSnapshot(): string | null {
  return null;
}

// 마지막으로 선택한 학년을 localStorage에 저장/복원한다.
// storageKey로 화면별 저장 공간을 분리한다(예: 프로젝트 목록 / 양식 제출 현황).
// SSR·하이드레이션 중에는 null을 반환해 초기 학년 깜빡임과 hydration mismatch를 함께 방지한다.
export function useStoredGrade(storageKey: string = DEFAULT_GRADE_STORAGE_KEY) {
  const getSnapshot = useCallback(
    () => window.localStorage.getItem(storageKey) ?? String(GRADES[0]),
    [storageKey],
  );

  const subscribe = useCallback(
    (onChange: () => void) => {
      const listeners = listenersMap.get(storageKey) ?? new Set();
      listeners.add(onChange);
      listenersMap.set(storageKey, listeners);

      // 다른 탭에서의 변경은 storage 이벤트로 전달되며, 해당 키만 반영한다.
      const handleStorage = (e: StorageEvent) => {
        if (e.key === storageKey) onChange();
      };
      window.addEventListener("storage", handleStorage);

      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0) listenersMap.delete(storageKey);
        window.removeEventListener("storage", handleStorage);
      };
    },
    [storageKey],
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const grade: Grade | null = snapshot === null ? null : parseGrade(snapshot);

  const setGrade = useCallback(
    (next: Grade) => {
      window.localStorage.setItem(storageKey, String(next));
      notify(storageKey);
    },
    [storageKey],
  );

  return { grade, setGrade };
}
