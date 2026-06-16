/** "2026-12-21" → "2026. 12. 21" */
export function formatDeadline(deadline: string) {
  if (!deadline || typeof deadline !== "string") return "";
  const parts = deadline.split("-");
  if (parts.length !== 3) return deadline;
  const [year, month, day] = parts;
  return `${year}. ${month}. ${day}`;
}
