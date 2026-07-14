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

let listeners: Array<() => void> = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
    window.removeEventListener("storage", onChange);
  };
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

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const grade: Grade | null = snapshot === null ? null : parseGrade(snapshot);

  const setGrade = useCallback(
    (next: Grade) => {
      window.localStorage.setItem(storageKey, String(next));
      listeners.forEach((listener) => listener());
    },
    [storageKey],
  );

  return { grade, setGrade };
}
