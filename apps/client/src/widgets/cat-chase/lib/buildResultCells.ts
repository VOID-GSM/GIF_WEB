import type { CatChaseQuestionResult } from "@/entities/cat-chase";

import type { BoardCell } from "../ui/CatChaseBoard";

// 문항 결과를 보드 칸 정보로 바꾼다. 고양이 칸이 쥐 칸보다 우선한다.
export function buildResultCells(question: CatChaseQuestionResult) {
  const cells = new Map<number, BoardCell>();

  question.mousePositions.forEach((position) =>
    cells.set(position, { content: "mouse" }),
  );

  const responses = new Map(question.responses.map((r) => [r.position, r]));

  question.catPositions.forEach((position) => {
    const response = responses.get(position);
    cells.set(position, {
      content: "cat",
      hadMouse: response?.hadMouse ?? question.mousePositions.includes(position),
      result: response ? (response.correct ? "correct" : "wrong") : undefined,
    });
  });

  return cells;
}
