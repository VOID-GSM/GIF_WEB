import { formatDotDate, formatRelative } from "@repo/i18n";

// ISO 시각 → "방금 전" / "n분 전" / "n시간 전" / "n일 전"(7일 미만) / "YYYY.MM.DD"
// locale 에 맞춰 상대 시간 문구를 만든다 (ko: "3분 전", ja: "3 分前").
export function formatRelativeTime(
  iso: string,
  locale: string = "ko",
  now: number = Date.now(),
) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return formatRelative(date, locale, now) ?? formatDotDate(date);
}
