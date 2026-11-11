import type { CatColor } from "@/entities/cat-chase";

import type { BoardCellContent } from "../ui/CatChaseBoard";

// 고양이 색을 보드 칸 이미지로 바꾼다. 색이 없는 고양이(예전 기록)는 노랑.
export const toCatCellContent = (color: CatColor | null): BoardCellContent =>
  color ? `cat-${color}` : "cat";
