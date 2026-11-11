export const LOCALES = ["ko", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

// next-intl 기본 쿠키 이름과 맞춘다.
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// 날짜·시간을 서버/클라이언트에서 같은 기준으로 포맷하기 위한 기본 시간대
export const TIME_ZONE = "Asia/Seoul";

// Intl API(toLocaleString 등)에 넘길 BCP 47 태그
export const INTL_LOCALES: Record<Locale, string> = {
  ko: "ko-KR",
  ja: "ja-JP",
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

// 쿠키 → Accept-Language → 기본값(ko) 순으로 언어를 정한다.
export function resolveLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (isLocale(cookieValue)) return cookieValue;

  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.split(";").map((s) => s.trim());
      const qParam = params.find((p) => /^q\s*=/i.test(p));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      return {
        lang: tag.split("-")[0].toLowerCase(),
        // 숫자가 아니면 1로 보고, q=0(허용 안 함)은 후보에서 뺀다.
        q: Number.isFinite(q) ? q : 1,
      };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q)
    .find(({ lang }) => isLocale(lang));

  return preferred ? (preferred.lang as Locale) : DEFAULT_LOCALE;
}
