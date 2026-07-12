"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import { useGetProjectNote, useUpdateProjectNote } from "@/entities/project";

interface MemoSectionProps {
  projectId: number;
}

// 메모 — 일정 대신 관리자가 팀별 메모 작성 (디자인 212-403 / 212-404)
// 서버에서 메모 내용을 불러와 표시하고, blur 또는 언마운트(페이지 이동) 시 변경분만 저장한다. 포커스 시 yellow scale/600 테두리.
// 부모에서 key={projectId}로 렌더하므로 프로젝트가 바뀌면 컴포넌트가 새로 마운트된다.
export default function MemoSection({ projectId }: MemoSectionProps) {
  const {
    data,
    isLoading,
    isError: isNoteQueryError,
  } = useGetProjectNote(projectId);
  const {
    mutate: updateNote,
    isPending,
    isSuccess,
    isError,
    submittedAt,
  } = useUpdateProjectNote(projectId);

  // 로컬 편집 state — 타이핑 중에는 이 값만 갱신하고, blur 시점에만 서버에 저장한다.
  const [memo, setMemo] = useState("");
  // 서버에서 받아온 원본 값 — blur 시 변경 여부 비교 및 초기화 1회 반영에 사용
  const savedContentRef = useRef<string | null>(null);
  // blur 없이 컴포넌트가 사라지는 경우(다른 프로젝트로 이동 등)에도 마지막 값을 저장할 수 있도록 최신값을 ref로 추적
  const memoRef = useRef(memo);
  const updateNoteRef = useRef(updateNote);
  useEffect(() => {
    updateNoteRef.current = updateNote;
  }, [updateNote]);

  // 서버 데이터가 처음 도착했을 때만 로컬 state를 초기화 — 사용자가 타이핑 중인 내용을 덮어쓰지 않는다.
  // 아직 메모를 작성한 적 없는 프로젝트는 조회가 에러(예: 404)로 내려올 수 있는데,
  // 이 경우에도 빈 값으로 초기화해야 저장이 막히지 않는다.
  useEffect(() => {
    if (data && savedContentRef.current === null) {
      savedContentRef.current = data.content;
      setMemo(data.content);
      memoRef.current = data.content;
    } else if (isNoteQueryError && savedContentRef.current === null) {
      savedContentRef.current = "";
    }
  }, [data, isNoteQueryError]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    memoRef.current = e.target.value;
    setMemo(e.target.value);
  };

  const handleBlur = () => {
    // 서버 원본 값과 다를 때만 저장 (성공/실패 토스트 및 invalidate는 훅 내부 처리)
    if (savedContentRef.current !== null && memo !== savedContentRef.current) {
      savedContentRef.current = memo;
      updateNote(memo);
    }
  };

  // 컴포넌트가 언마운트될 때(다른 프로젝트로 이동, 페이지 이탈 등) blur 없이도 마지막 변경분을 저장한다.
  // ref만 참조하므로 의존성 배열을 비워도 항상 최신 값을 읽는다.
  useEffect(() => {
    return () => {
      if (
        savedContentRef.current !== null &&
        memoRef.current !== savedContentRef.current
      ) {
        savedContentRef.current = memoRef.current;
        updateNoteRef.current(memoRef.current);
      }
    };
  }, []);

  const statusText = isPending
    ? "저장 중..."
    : isError
      ? "저장 실패"
      : isSuccess && submittedAt
        ? `저장됨 · ${new Date(submittedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`
        : null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold tracking-tight text-gray-600">
          메모
        </span>
        {statusText && (
          <span
            className={`text-sm font-medium ${isError ? "text-red-600" : "text-gray-500"}`}
          >
            {statusText}
          </span>
        )}
      </div>
      <textarea
        value={memo}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isLoading}
        placeholder="메모를 입력하세요"
        className="h-[300px] w-full resize-none rounded-xl border border-transparent bg-white p-4 text-base font-medium leading-relaxed tracking-tight text-gray-900 shadow outline-none transition-colors placeholder:text-gray-600 focus:border-yellow-600 disabled:opacity-60 lg:w-[378px]"
      />
    </section>
  );
}
