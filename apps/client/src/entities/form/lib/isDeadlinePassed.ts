/**
 * 제출 마감일이 지났는지 여부.
 * - 시간 포함(YYYY-MM-DDTHH:mm:ss) → 해당 시각까지 제출 가능
 * - 날짜만(YYYY-MM-DD) → 당일 자정까지 제출 가능
 */
export function isDeadlinePassed(deadline: string) {
  if (!deadline || typeof deadline !== "string") return false;
  // 이미 타임존(Z 또는 ±HH:mm)이 있으면 그대로 쓰고, 없을 때만 KST(+09:00)를 붙인다.
  const hasTimezone = deadline.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(deadline);
  const iso = deadline.includes("T") ? deadline : `${deadline}T23:59:59`;
  const end = new Date(hasTimezone ? iso : `${iso}+09:00`);
  const endTime = end.getTime();
  return !isNaN(endTime) && Date.now() > endTime;
}
