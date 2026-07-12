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
  // 마지막으로 서버에 저장 성공한 값 — 렌더링 중 변경 여부 비교(hasUnsavedChanges)에 쓰이므로 state로 관리한다.
  const [savedContent, setSavedContent] = useState<string | null>(null);
  // "초기화가 이미 끝났는지 / 최신 저장값이 뭔지"를 이벤트 핸들러·이펙트에서만 참조하기 위한 ref.
  // savedContent state와 항상 함께 갱신하며, 렌더링 중에는 절대 읽지 않는다.
  const memoRef = useRef(memo);
  const savedContentRef = useRef<string | null>(null);
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
      setSavedContent(data.content);
      setMemo(data.content);
      memoRef.current = data.content;
    } else if (isNoteQueryError && savedContentRef.current === null) {
      savedContentRef.current = "";
      setSavedContent("");
    }
  }, [data, isNoteQueryError]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    memoRef.current = e.target.value;
    setMemo(e.target.value);
  };

  const handleBlur = () => {
    // 서버 원본 값과 다를 때만 저장. 실패 시 재시도가 가능하도록 savedContent는
    // 요청 성공(onSuccess) 시점에만 갱신한다 — 실패해도 미리 갱신해버리면 재blur해도 재저장 안 됨.
    if (savedContent !== null && memo !== savedContent) {
      const contentToSave = memo;
      updateNote(contentToSave, {
        onSuccess: () => {
          savedContentRef.current = contentToSave;
          setSavedContent(contentToSave);
        },
      });
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
        const contentToSave = memoRef.current;
        updateNoteRef.current(contentToSave, {
          onSuccess: () => {
            savedContentRef.current = contentToSave;
          },
        });
      }
    };
  }, []);

  // 저장 성공 이후에도 사용자가 다시 편집을 시작하면(현재 값이 마지막 저장값과 다르면)
  // "저장됨" 문구 대신 상태 표시를 비워서 아직 반영 안 된 변경사항이 있음을 알린다.
  const hasUnsavedChanges = savedContent !== null && memo !== savedContent;

  const statusText = isPending
    ? "저장 중..."
    : isError
      ? "저장 실패"
      : isSuccess && submittedAt && !hasUnsavedChanges
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
