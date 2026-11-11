"use client";

import { useTranslations } from "next-intl";

import Moon from "../../../svg/Moon";
import Sun from "../../../svg/Sun";
import { useTheme } from "../model/ThemeContext";
import type { ThemeMode } from "../model/type";

const OPTIONS: { value: ThemeMode; labelKey: "light" | "dark"; Icon: typeof Sun }[] = [
  { value: "light", labelKey: "light", Icon: Sun },
  { value: "dark", labelKey: "dark", Icon: Moon },
];

export default function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label={t("select")}
      className="grid w-full grid-cols-2 gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
    >
      {OPTIONS.map(({ value, labelKey, Icon }) => {
        const label = t(labelKey);
        const isActive = resolvedTheme === value;
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
