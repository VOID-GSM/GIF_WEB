/** "2026-12-21" → "2026. 12. 21" */
export function formatDeadline(deadline: string) {
  const [year, month, day] = deadline.split("-");
  return `${year}. ${month}. ${day}`;
}
