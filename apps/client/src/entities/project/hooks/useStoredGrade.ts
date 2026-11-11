"use client";

import { useCallback, useSyncExternalStore } from "react";

import { GRADES, type Grade, type GradeFilterValue } from "../model/types";

const GRADE_STORAGE_KEY = "projectListGrade";

// 저장된 값이 "all"이면 전체, 학년 숫자면 해당 학년, 그 외에는 기본 학년으로 복원한다.
function parseGrade(value: string | null): GradeFilterValue {
  if (value === "all") return "all";

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

function getSnapshot() {
  return window.localStorage.getItem(GRADE_STORAGE_KEY) ?? String(GRADES[0]);
}

function getServerSnapshot(): string | null {
  return null;
}

// 마지막으로 선택한 학년(전체 포함)을 localStorage에 저장/복원한다.
// SSR·하이드레이션 중에는 null을 반환해 초기 학년 깜빡임과 hydration mismatch를 함께 방지한다.
export function useStoredGrade() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const grade: GradeFilterValue | null =
    snapshot === null ? null : parseGrade(snapshot);

  const setGrade = useCallback((next: GradeFilterValue) => {
    window.localStorage.setItem(GRADE_STORAGE_KEY, String(next));
    listeners.forEach((listener) => listener());
  }, []);

  return { grade, setGrade };
}
