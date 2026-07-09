/**
 * 제출 마감일이 지났는지 여부.
 * - 시간 포함(YYYY-MM-DDTHH:mm:ss) → 해당 시각까지 제출 가능
 * - 날짜만(YYYY-MM-DD) → 당일 자정까지 제출 가능
 */
export function isDeadlinePassed(deadline: string) {
  if (!deadline || typeof deadline !== "string") return false;
  const iso = deadline.includes("T") ? deadline : `${deadline}T23:59:59`;
  const end = new Date(`${iso}+09:00`);
  const endTime = end.getTime();
  return !isNaN(endTime) && Date.now() > endTime;
}
