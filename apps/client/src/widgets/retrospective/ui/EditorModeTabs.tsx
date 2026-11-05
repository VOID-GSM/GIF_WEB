import type { EditorMode } from "../lib/editorMode";

const MODE_OPTIONS: { value: EditorMode; label: string }[] = [
  { value: "write", label: "작성" },
  { value: "preview", label: "미리보기" },
  { value: "split", label: "같이 보기" },
];

interface EditorModeTabsProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
  charCount: number;
}

export default function EditorModeTabs({
  mode,
  onChange,
  charCount,
}: EditorModeTabsProps) {
  return (
    <div className="flex items-center justify-between">
      <div
        role="tablist"
        aria-label="편집 · 미리보기"
        className="flex items-center gap-1"
      >
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={mode === option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-all duration-150 ${
              mode === option.value
                ? "bg-yellow-600 text-gray-900 active:brightness-95"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-[12px] text-gray-400 tabular-nums">
        {charCount}자
      </p>
    </div>
  );
}
