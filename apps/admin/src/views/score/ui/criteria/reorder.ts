export type MoveDirection = "up" | "down";

interface Orderable {
  id: number;
  displayOrder: number;
}

// index 위치의 행을 위/아래로 한 칸 옮긴 뒤 0부터 다시 번호를 매기고,
// displayOrder가 실제로 바뀌는 행만 돌려준다. (기존 값이 중복돼 있어도 정리된다)
export function getReorderChanges<T extends Orderable>(
  list: T[],
  index: number,
  direction: MoveDirection,
): { id: number; displayOrder: number }[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return [];

  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];

  return next
    .map((row, i) => ({ id: row.id, displayOrder: i, changed: row.displayOrder !== i }))
    .filter((row) => row.changed)
    .map(({ id, displayOrder }) => ({ id, displayOrder }));
}
