/** "2026-07-10T03:05:00" → "2026. 07. 10 03:05" (시간 포함, 초 제외) */
export function formatDeadline(deadline: string) {
  if (!deadline || typeof deadline !== "string") return "";
  const [datePart, timePart] = deadline.split("T");
  const parts = datePart.split("-");
  if (parts.length !== 3) return deadline;
  const [year, month, day] = parts;
  const date = `${year}. ${month}. ${day}`;
  if (!timePart) return date;
  const [hour = "00", minute = "00"] = timePart.split(":");
  return `${date} ${hour}:${minute}`;
}

/**
 * 서버가 UTC로 내려주는 타임스탬프(createdAt·answeredAt·submittedAt 등)를
 * KST(Asia/Seoul) 기준 "2026. 07. 14 02:24" 형태로 변환한다.
 * - 마감일(deadline)은 KST 문자열이라 formatDeadline을 그대로 쓰지만,
 *   서버 생성 시각은 UTC라 이 함수로 +9시간 변환해 표시해야 한다.
 * - 타임존 정보(Z 또는 ±HH:mm)가 없으면 UTC로 간주해 붙인 뒤 변환한다.
 */
export function formatTimestamp(timestamp: string) {
  if (!timestamp || typeof timestamp !== "string") return "";
  const hasTimezone =
    timestamp.endsWith("Z") || /[+-]\d{2}(?::?\d{2})?$/.test(timestamp);
  const iso = timestamp.includes("T") ? timestamp : `${timestamp}T00:00:00`;
  const date = new Date(hasTimezone ? iso : `${iso}Z`);
  if (isNaN(date.getTime())) return formatDeadline(timestamp);

  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}. ${get("month")}. ${get("day")} ${hour}:${get("minute")}`;
}

/** "2026-07-10T03:05:00" → "2026. 07. 10" (날짜만) */
export function formatDeadlineDate(deadline: string) {
  if (!deadline || typeof deadline !== "string") return "";
  const [datePart] = deadline.split("T");
  const parts = datePart.split("-");
  if (parts.length !== 3) return deadline;
  const [year, month, day] = parts;
  return `${year}. ${month}. ${day}`;
}

/** "2026-07-10T03:05:00" → "03:05" (시간만, 초 제외 / 시간 정보 없으면 "") */
export function formatDeadlineTime(deadline: string) {
  if (!deadline || typeof deadline !== "string") return "";
  const timePart = deadline.split("T")[1];
  if (!timePart) return "";
  const [hour = "00", minute = "00"] = timePart.split(":");
  return `${hour}:${minute}`;
}
