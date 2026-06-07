/** 제출 마감일(YYYY-MM-DD)이 지났는지 여부 — 마감일 당일 자정까지는 제출 가능 */
export function isDeadlinePassed(deadline: string) {
  if (!deadline || typeof deadline !== "string") return false;
  const end = new Date(`${deadline}T23:59:59`);
  const endTime = end.getTime();
  return !isNaN(endTime) && Date.now() > endTime;
}
