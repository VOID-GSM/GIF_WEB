import { useTranslations } from "next-intl";
import type { EditorMode } from "../lib/editorMode";

const MODE_OPTIONS: EditorMode[] = ["write", "preview", "split"];

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
  const t = useTranslations("retrospective.editor");
  return (
    <div className="flex items-center justify-between">
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="flex items-center gap-1"
      >
        {MODE_OPTIONS.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => onChange(value)}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-all duration-150 ${
              mode === value
                ? "bg-yellow-600 text-gray-900 active:brightness-95"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t(`mode.${value}`)}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-[12px] text-gray-400 tabular-nums">
        {t("charCount", { count: charCount })}
      </p>
    </div>
  );
}
