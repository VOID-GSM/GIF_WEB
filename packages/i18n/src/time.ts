import { DEFAULT_LOCALE, INTL_LOCALES, TIME_ZONE, isLocale } from "./config";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const JUST_NOW: Record<string, string> = { ko: "방금 전", ja: "たった今" };

// 7일 미만이면 "방금 전" / "n분 전" / "n시간 전" / "n일 전" 을 돌려주고,
// 그보다 오래됐으면 null 을 돌려줘 호출부가 날짜 형식을 정하게 한다.
export function formatRelative(
  date: Date,
  locale: string = DEFAULT_LOCALE,
  now: number = Date.now(),
): string | null {
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const diff = Math.max(0, now - date.getTime());
  const relative = new Intl.RelativeTimeFormat(INTL_LOCALES[lang], {
    numeric: "always",
  });

  if (diff < MINUTE) return JUST_NOW[lang] ?? JUST_NOW[DEFAULT_LOCALE]!;
  if (diff < HOUR) return relative.format(-Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return relative.format(-Math.floor(diff / HOUR), "hour");
  if (diff < 7 * DAY) return relative.format(-Math.floor(diff / DAY), "day");
  return null;
}

// 실행 환경 시간대와 관계없이 TIME_ZONE 기준 "YYYY.MM.DD"
export function formatDotDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}.${get("month")}.${get("day")}`;
}
