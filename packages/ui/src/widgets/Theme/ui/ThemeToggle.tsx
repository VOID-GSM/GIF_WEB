"use client";

import Moon from "../../../svg/Moon";
import Sun from "../../../svg/Sun";
import { useTheme } from "../model/ThemeContext";
import type { ThemeMode } from "../model/type";

const OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "라이트", Icon: Sun },
  { value: "dark", label: "다크", Icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="테마 선택"
      className="grid w-full grid-cols-2 gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={`flex items-center justify-center rounded-full py-1.5 transition-colors ${
              isActive
                ? "bg-[var(--color-gray-900)] text-[var(--color-white)] dark:bg-[var(--color-white)] dark:text-[var(--color-gray-900)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
