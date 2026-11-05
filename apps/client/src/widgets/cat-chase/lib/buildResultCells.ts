import { isCorrectJudgment, type CatChaseRoundDetail } from "@/entities/cat-chase";

import type { BoardCell } from "../ui/CatChaseBoard";

// 상세 조회 결과를 보드 칸 정보로 바꾼다. 고양이 칸이 쥐 칸보다 우선한다.
export function buildResultCells(detail: CatChaseRoundDetail) {
  const cells = new Map<number, BoardCell>();

  detail.mousePositions.forEach((position) =>
    cells.set(position, { content: "mouse" }),
  );

  const responses = new Map(detail.responses.map((r) => [r.position, r]));

  detail.catPositions.forEach((position) => {
    const response = responses.get(position);
    const hadMouse =
      response?.hadMouse ?? detail.mousePositions.includes(position);
    cells.set(position, {
      content: "cat",
      hadMouse,
      result: response
        ? isCorrectJudgment(response)
          ? "correct"
          : "wrong"
        : undefined,
    });
  });

  return cells;
}
