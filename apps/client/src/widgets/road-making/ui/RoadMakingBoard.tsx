"use client";

import {
  ROAD_MAKING_COLORS,
  type BoardPosition,
  type RoadMakingDirection,
  type RoadMakingPerson,
  type RoadMakingVehicle,
  type RoadMakingVehicleResult,
} from "@/entities/assessment";

import {
  DIRECTION_LABEL,
  FencePiece,
  PersonPiece,
  ResultBadge,
  VehiclePiece,
} from "./RoadMakingPieces";

export const cellKey = (row: number, col: number) => `${row}-${col}`;

const DIRECTION_DELTA: Record<RoadMakingDirection, [number, number]> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

interface RoadMakingBoardProps {
  rows: number;
  cols: number;
  vehicles: RoadMakingVehicle[];
  people: RoadMakingPerson[];
  fences: Set<string>;
  // 울타리를 더 놓을 수 있는지 (빈 칸 hover 미리보기에 사용)
  canPlaceMore: boolean;
  disabled: boolean;
  // 제출 후 서버가 돌려준 실제 이동 경로
  results: RoadMakingVehicleResult[] | null;
  onToggle: (row: number, col: number) => void;
}

// 보드는 세 겹으로 그린다: 칸(클릭) → 경로 선 → 차·사람·결과 배지.
// 경로 선이 차와 사람 아이콘을 덮지 않도록 아이콘을 맨 위에 둔다.
export default function RoadMakingBoard({
  rows,
  cols,
  vehicles,
  people,
  fences,
  canPlaceMore,
  disabled,
  results,
  onToggle,
}: RoadMakingBoardProps) {
  const vehicleAt = new Map(
    vehicles.map((v) => [cellKey(v.position.row, v.position.col), v]),
  );
  const personAt = new Map(
    people.map((p) => [cellKey(p.position.row, p.position.col), p]),
  );
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] rounded-[20px] bg-[#eef3e6] p-2 ring-1 ring-black/5 sm:p-3"
      style={{ aspectRatio: `${cols} / ${rows}` }}
    >
      <div className="relative size-full">
        {/* 1. 칸 */}
        <div
          role="grid"
          aria-label={`${rows}×${cols} 길 만들기 보드`}
          className="grid size-full"
          style={gridStyle}
        >
          {Array.from({ length: rows * cols }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const key = cellKey(row, col);
            const vehicle = vehicleAt.get(key);
            const person = personAt.get(key);
            const hasFence = fences.has(key);

            if (vehicle || person) {
              const label = vehicle
                ? `${ROAD_MAKING_COLORS[vehicle.color].label} 차, ${DIRECTION_LABEL[vehicle.direction]} 방향`
                : `${ROAD_MAKING_COLORS[person!.color].label} 사람`;
              return <div key={key} role="gridcell" aria-label={label} />;
            }

            // 칸 사이 간격은 padding 으로 만들어 경로 좌표를 칸 중심에 맞춘다.
            return (
              <div key={key} role="gridcell" className="p-[5%]">
                <button
                  type="button"
                  disabled={disabled}
                  aria-pressed={hasFence}
                  aria-label={`${row + 1}행 ${col + 1}열 ${hasFence ? "울타리 치우기" : "울타리 놓기"}`}
                  onClick={() => onToggle(row, col)}
                  className={`group flex size-full items-center justify-center rounded-[22%] border transition-all duration-150 disabled:cursor-default ${
                    hasFence
                      ? "border-[#d9a35f] bg-[#fff1dc] shadow-[inset_0_-3px_0_rgba(168,105,42,0.18)]"
                      : "border-black/5 bg-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.04)] enabled:hover:-translate-y-px enabled:hover:border-[#d9a35f] enabled:active:translate-y-0"
                  }`}
                >
                  {hasFence ? (
                    <FencePiece />
                  ) : (
                    canPlaceMore &&
                    !disabled && (
                      <span className="hidden size-full items-center justify-center group-hover:flex">
                        <FencePiece ghost />
                      </span>
                    )
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 2. 경로 선 */}
        {results && (
          <PathLines
            rows={rows}
            cols={cols}
            results={results}
            vehicles={vehicles}
            fences={fences}
            personAt={personAt}
          />
        )}

        {/* 3. 차·사람·결과 배지 */}
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={gridStyle}
          aria-hidden
        >
          {vehicles.map((v) => (
            <PieceCell key={`v-${v.color}`} position={v.position}>
              <VehiclePiece color={v.color} direction={v.direction} />
            </PieceCell>
          ))}
          {people.map((p) => (
            <PieceCell key={`p-${p.color}`} position={p.position}>
              <PersonPiece color={p.color} />
            </PieceCell>
          ))}
          {results?.map((result, i) => {
            const last = result.path[result.path.length - 1];
            return (
              <div
                key={`r-${result.color}-${i}`}
                className="relative"
                style={{ gridRow: last.row + 1, gridColumn: last.col + 1 }}
              >
                {/* 같은 칸에서 끝난 차가 여럿이면 배지를 조금씩 아래로 내린다 */}
                <span
                  className="absolute right-0 size-[34%] animate-[badge-pop_0.25s_ease-out_0.4s_both]"
                  style={{ top: `${i * 8}%` }}
                >
                  <ResultBadge color={result.color} reached={result.reached} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes badge-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function PieceCell({
  position,
  children,
}: {
  position: BoardPosition;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-[5%]"
      style={{ gridRow: position.row + 1, gridColumn: position.col + 1 }}
    >
      {children}
    </div>
  );
}

const CLOCKWISE: RoadMakingDirection[] = ["UP", "RIGHT", "DOWN", "LEFT"];

// 서버 경로에는 보드 안 칸만 있으므로, 마지막 칸에서 어느 쪽으로 빠져나갔는지 서버 규칙대로 다시 따져본다.
// (진행 방향 앞이 울타리면 시계 방향으로 돌고, 보드 밖이면 그쪽으로 나간다)
function findExitDirection(
  result: RoadMakingVehicleResult,
  vehicles: RoadMakingVehicle[],
  fences: Set<string>,
  rows: number,
  cols: number,
): [number, number] | null {
  const { path } = result;
  const last = path[path.length - 1];
  const prev = path[path.length - 2];
  let dir: RoadMakingDirection | undefined = prev
    ? CLOCKWISE.find((d) => {
        const [dr, dc] = DIRECTION_DELTA[d];
        return last.row - prev.row === dr && last.col - prev.col === dc;
      })
    : vehicles.find((v) => v.color === result.color)?.direction;
  if (!dir) return null;

  for (let turn = 0; turn < 4; turn++) {
    const [dr, dc] = DIRECTION_DELTA[dir];
    const nr = last.row + dr;
    const nc = last.col + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return [dr, dc];
    if (!fences.has(cellKey(nr, nc))) return null;
    dir = CLOCKWISE[(CLOCKWISE.indexOf(dir) + 1) % 4];
  }
  return null;
}

function PathLines({
  rows,
  cols,
  results,
  vehicles,
  fences,
  personAt,
}: {
  rows: number;
  cols: number;
  results: RoadMakingVehicleResult[];
  vehicles: RoadMakingVehicle[];
  fences: Set<string>;
  personAt: Map<string, RoadMakingPerson>;
}) {
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      aria-hidden
    >
      {results.map((result, i) => {
        const { solid } = ROAD_MAKING_COLORS[result.color];
        // 여러 차가 같은 칸을 지나가도 선이 겹치지 않도록 조금씩 비켜 그린다.
        const offset = (i - (results.length - 1) / 2) * 0.1;
        const points: [number, number][] = result.path.map((p) => [
          p.col + 0.5 + offset,
          p.row + 0.5 + offset,
        ]);

        // 사람에게 닿지 못하고 보드 밖으로 나간 차는 선을 테두리 너머까지 이어 나간 것을 보여준다.
        const last = result.path[result.path.length - 1];
        const stoppedAtPerson = personAt.has(cellKey(last.row, last.col));
        if (!result.reached && !stoppedAtPerson) {
          const exit = findExitDirection(result, vehicles, fences, rows, cols);
          if (exit) {
            const [x, y] = points[points.length - 1];
            points.push([x + exit[1] * 0.75, y + exit[0] * 0.75]);
          }
        }

        if (points.length < 2) return null;
        return (
          <polyline
            key={`${result.color}-${i}`}
            points={points.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke={solid}
            strokeWidth={0.14}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={0.9}
            strokeDasharray={result.reached ? undefined : "0.22 0.16"}
          >
            <animate
              attributeName="stroke-opacity"
              from="0"
              to="0.9"
              dur="0.5s"
              fill="freeze"
            />
          </polyline>
        );
      })}
    </svg>
  );
}
