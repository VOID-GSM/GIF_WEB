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
