"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Markdown } from "@repo/ui";

import type { EditorMode } from "../lib/editorMode";
import EditorModeTabs from "./EditorModeTabs";
import EditorToolbar, { type ToolbarItem } from "./EditorToolbar";

export type { EditorMode };

interface RetrospectiveEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** 상위에서 레이아웃(사이드 패널 폭 등)을 같이 조정할 수 있도록 모드를 알려준다 */
  onModeChange?: (mode: EditorMode) => void;
}

export default function RetrospectiveEditor({
  value,
  onChange,
  onModeChange,
}: RetrospectiveEditorProps) {
  const [mode, setMode] = useState<EditorMode>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const changeMode = (next: EditorMode) => {
    setMode(next);
    onModeChange?.(next);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onModeChange?.(mode), []);

  const applyItem = (item: ToolbarItem) => {
    if (item.disabled) {
      toast.info("이미지 추가 기능은 아직 준비 중이에요.");
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    let next: string;
    let cursor: number;

    if (item.prefix) {
      // 줄 시작 위치를 찾아 접두어를 붙인다
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      next = `${value.slice(0, lineStart)}${item.prefix}${value.slice(lineStart)}`;
      cursor = end + item.prefix.length;
    } else if (item.wrap) {
      const [open, close] = item.wrap;
      next = `${value.slice(0, start)}${open}${selected}${close}${value.slice(end)}`;
      cursor = start + open.length + selected.length;
    } else {
      return;
    }

    onChange(next);

    // 값 반영 후 커서를 되돌려 놓는다
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <EditorModeTabs mode={mode} onChange={changeMode} charCount={value.length} />

      {mode !== "preview" && <EditorToolbar onItemClick={applyItem} />}

      <div
        className={
          mode === "split" ? "grid grid-cols-1 gap-3 lg:grid-cols-2" : ""
        }
      >
        {mode !== "preview" && (
          <div>
            <label htmlFor="retrospective-content" className="sr-only">
              회고록 내용
            </label>
            <textarea
              id="retrospective-content"
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="마크다운으로 자유롭게 기록해보세요."
              className={`thin-scrollbar w-full resize-none rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-[13px] leading-relaxed font-medium text-black outline-none transition-colors placeholder:text-gray-400 focus:border-yellow-600 ${
                mode === "split" ? "h-[420px]" : "h-[560px]"
              }`}
            />
          </div>
        )}

        {mode !== "write" && (
          <div
            className={`thin-scrollbar overflow-y-auto rounded-[10px] border border-gray-200 bg-white px-4 py-3 ${
              mode === "split" ? "h-[420px]" : "h-[560px]"
            }`}
          >
            {value.trim() ? (
              <Markdown content={value} />
            ) : (
              <p className="text-[13px] text-gray-400">
                미리볼 내용이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
