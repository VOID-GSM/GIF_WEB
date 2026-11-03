import Image from "next/image";

const ASSET = "/assessment/cat-chase";

const CAT_CELL_IMAGE = {
  cat: `${ASSET}/cell-cat.svg`,
  "cat-red": `${ASSET}/cell-cat-red.svg`,
  "cat-blue": `${ASSET}/cell-cat-blue.svg`,
} as const;

export type BoardCellContent = "mouse" | keyof typeof CAT_CELL_IMAGE;

export interface BoardCell {
  content: BoardCellContent;
  // 결과 화면: 판단이 맞았는지 표시
  result?: "correct" | "wrong";
  // 결과 화면: 고양이 칸에 쥐가 있었는지 함께 표시
  hadMouse?: boolean;
}

interface CatChaseBoardProps {
  gridSize: number;
  cells: Map<number, BoardCell>;
  // 게임 화면: 스크롤 없이 화면 높이 안에 들어오도록 줄인다
  fitViewport?: boolean;
}

// 칸 120px + 간격 16px 기준(디자인 6x6 = 800px)
const CELL_SIZE = 120;
const GAP = 16;

export default function CatChaseBoard({
  gridSize,
  cells,
  fitViewport,
}: CatChaseBoardProps) {
  const maxWidth = gridSize * CELL_SIZE + (gridSize - 1) * GAP;
  // 상단 진행 표시 + 위아래 여백만큼 뺀 높이
  const width = fitViewport
    ? `min(100%, ${maxWidth}px, calc(100dvh - 140px))`
    : `min(100%, ${maxWidth}px)`;

  return (
    <div
      className="grid gap-1.5 sm:gap-2.5 lg:gap-4"
      style={{
        width,
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, position) => (
        <BoardCellView key={position} cell={cells.get(position)} />
      ))}
    </div>
  );
}

function BoardCellView({ cell }: { cell?: BoardCell }) {
  if (!cell || cell.content === "mouse") {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[16.67%] border border-gray-600 bg-white">
        {cell && (
          <Image
            src={`${ASSET}/mouse.svg`}
            alt="쥐"
            width={101.5}
            height={92.9478}
            className="animate-pop-in absolute left-[7.5%] top-[9.6%] h-auto w-[84.58%]"
          />
        )}
      </div>
    );
  }

  return (
    <div className="animate-pop-in relative aspect-square">
      <Image
        src={CAT_CELL_IMAGE[cell.content]}
        alt="고양이"
        width={120}
        height={120}
        className="h-auto w-full"
      />
      {cell.hadMouse && (
        <Image
          src={`${ASSET}/mouse.svg`}
          alt="쥐가 있던 칸"
          width={101.5}
          height={92.9478}
          className="absolute -bottom-[6%] -right-[6%] h-auto w-[42%] drop-shadow"
        />
      )}
      {cell.result && (
        <span
          aria-label={cell.result === "correct" ? "정답" : "오답"}
          className={`absolute -left-[6%] -top-[6%] flex size-[34%] items-center justify-center rounded-full text-[clamp(10px,2vw,18px)] font-bold text-white shadow ${
            cell.result === "correct" ? "bg-green-dark" : "bg-red"
          }`}
        >
          {cell.result === "correct" ? "O" : "X"}
        </span>
      )}
    </div>
  );
}
