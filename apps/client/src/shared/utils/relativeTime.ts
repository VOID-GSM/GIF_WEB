const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// ISO 시각 → "방금 전" / "n분 전" / "n시간 전" / "n일 전"(7일 미만) / "YYYY.MM.DD"
export function formatRelativeTime(iso: string, now: number = Date.now()) {
  const date = new Date(iso);
  const time = date.getTime();
  if (Number.isNaN(time)) return "";

  const diff = Math.max(0, now - time);
  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}일 전`;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}
