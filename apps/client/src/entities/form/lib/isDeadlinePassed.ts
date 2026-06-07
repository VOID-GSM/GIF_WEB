/** 제출 마감일(YYYY-MM-DD)이 지났는지 여부 — 마감일 당일 자정까지는 제출 가능 */
export function isDeadlinePassed(deadline: string) {
  const end = new Date(`${deadline}T23:59:59`);
  return Date.now() > end.getTime();
}
