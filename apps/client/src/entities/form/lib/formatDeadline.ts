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
