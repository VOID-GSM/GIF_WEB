"use client";

import { useState } from "react";

interface MemoSectionProps {
  projectId: number;
}

// 메모 — 일정 대신 관리자가 팀별 메모 작성 (디자인 212-403 / 212-404)
// 프로젝트별로 localStorage에 저장(브라우저 로컬). 포커스 시 yellow scale/600 테두리.
// 부모에서 key={projectId}로 렌더하므로 프로젝트가 바뀌면 초기값을 다시 읽는다.
export default function MemoSection({ projectId }: MemoSectionProps) {
  const storageKey = `project-memo-${projectId}`;

  // localStorage는 클라이언트에서만 접근 — lazy initializer로 마운트 시 1회 로드
  const [memo, setMemo] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (localStorage.getItem(storageKey) ?? ""),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setMemo(next);
    localStorage.setItem(storageKey, next);
  };

  return (
    <section className="flex flex-col gap-3">
      <span className="text-xl font-semibold tracking-tight text-gray-600">
        메모
      </span>
      <textarea
        suppressHydrationWarning
        value={memo}
        onChange={handleChange}
        placeholder="메모를 입력하세요"
        className="h-[200px] w-full resize-none rounded-xl border border-transparent bg-white p-4 text-base font-medium leading-relaxed tracking-tight text-gray-900 shadow outline-none transition-colors placeholder:text-gray-600 focus:border-yellow-600 lg:w-[378px]"
      />
    </section>
  );
}
