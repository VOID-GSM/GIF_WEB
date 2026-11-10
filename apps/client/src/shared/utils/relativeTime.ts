const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

import { INTL_LOCALES, isLocale } from "@repo/i18n";

const JUST_NOW: Record<string, string> = { ko: "방금 전", ja: "たった今" };

// ISO 시각 → "방금 전" / "n분 전" / "n시간 전" / "n일 전"(7일 미만) / "YYYY.MM.DD"
// locale 에 맞춰 상대 시간 문구를 만든다 (ko: "3분 전", ja: "3 分前").
export function formatRelativeTime(
  iso: string,
  locale: string = "ko",
  now: number = Date.now(),
) {
  const date = new Date(iso);
  const time = date.getTime();
  if (Number.isNaN(time)) return "";

  const diff = Math.max(0, now - time);
  const lang = isLocale(locale) ? locale : "ko";
  const relative = new Intl.RelativeTimeFormat(INTL_LOCALES[lang], {
    numeric: "always",
  });
  if (diff < MINUTE) return JUST_NOW[lang];
  if (diff < HOUR) return relative.format(-Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return relative.format(-Math.floor(diff / HOUR), "hour");
  if (diff < 7 * DAY) return relative.format(-Math.floor(diff / DAY), "day");

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}
