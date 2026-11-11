"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setCookieValue } from "@repo/lib";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@repo/i18n";

// 버튼에는 "전환될 언어"를 보여준다. (한국어 화면 → JP, 일본어 화면 → KR)
const NEXT_LOCALE: Record<Locale, { locale: Locale; label: string }> = {
  ko: { locale: "ja", label: "JP" },
  ja: { locale: "ko", label: "KR" },
};

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const t = useTranslations("language");
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const next =
    NEXT_LOCALE[(locale in NEXT_LOCALE ? locale : DEFAULT_LOCALE) as Locale];

  const handleClick = () => {
    setCookieValue(LOCALE_COOKIE, next.locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "Lax",
    });
    // 서버 컴포넌트를 다시 렌더링해 새 언어의 메시지를 받아온다.
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={t("switchTo", { locale: next.locale })}
      title={t("switchTo", { locale: next.locale })}
      className={`flex h-8 min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[13px] font-bold tracking-wide text-[var(--color-text-secondary)] outline-none transition-colors hover:text-[var(--color-text-primary)] focus-visible:text-[var(--color-text-primary)] disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      {next.label}
    </button>
  );
}
