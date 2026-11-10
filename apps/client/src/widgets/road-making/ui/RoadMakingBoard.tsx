"use client";

import {
  ROAD_MAKING_COLORS,
  type BoardPosition,
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
import {
  cellKey,
  simulateVehicle,
  type SimulatedPath,
} from "../lib/simulateRoad";

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
  // 울타리를 놓을 때마다 차가 화살표 방향으로 어떻게 움직이는지 바로 계산한다.
  const simulated = vehicles.map((v) =>
    simulateVehicle(v, personAt, fences, rows, cols),
  );
  // 제출 후에는 서버가 돌려준 경로를 그린다. 보드 밖으로 나간 방향만 계산 결과에서 가져온다.
  const lines: SimulatedPath[] = results
    ? results.map((r) => {
        const last = r.path[r.path.length - 1];
        const sim = simulated.find((s) => s.color === r.color);
        const sameEnd =
          sim &&
          sim.path[sim.path.length - 1].row === last.row &&
          sim.path[sim.path.length - 1].col === last.col;
        return { ...r, exit: !r.reached && sameEnd ? sim.exit : null };
      })
    : simulated;

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

        {/* 2. 경로 선 (제출 전에는 미리보기, 제출 후에는 서버 결과) */}
        <PathLines rows={rows} cols={cols} lines={lines} preview={!results} />

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

// 화살촉 끝이 원점에 오도록 그린 삼각형 (오른쪽을 가리킴)
const ARROW_LENGTH = 0.26;
const ARROW_HEAD = `M0,0 L${-ARROW_LENGTH},-0.15 L${-ARROW_LENGTH},0.15 Z`;
// 사람 칸 중심에서 이만큼 앞에서 선을 끝낸다 (아이콘 바로 바깥)
const END_INSET = 0.48;
// 보드 밖으로 나간 선을 칸 중심에서 이만큼 늘린다 (보드 테두리 안쪽까지)
const EXIT_LENGTH = 0.62;
// 같은 구간을 지나는 선끼리 비켜 그리는 간격
const OVERLAP_GAP = 0.12;

// 다른 차와 같은 구간을 지나는 선만 조금씩 비켜 그린다. 혼자 가는 선은 칸 중심을 지난다.
function overlapOffsets(lines: SimulatedPath[]): number[] {
  const segments = lines.map(
    (line) =>
      new Set(
        line.path.slice(1).map((p, j) => {
          const a = cellKey(line.path[j].row, line.path[j].col);
          const b = cellKey(p.row, p.col);
          return a < b ? `${a}|${b}` : `${b}|${a}`;
        }),
      ),
  );
  const overlapping = segments.map((mine, i) =>
    [...mine].some((s) => segments.some((other, j) => j !== i && other.has(s))),
  );
  const count = overlapping.filter(Boolean).length;
  let rank = 0;
  return overlapping.map((o) =>
    o ? (rank++ - (count - 1) / 2) * OVERLAP_GAP : 0,
  );
}

// j번째 구간(points[j] → points[j+1])의 단위 방향
function segmentDir(points: [number, number][], j: number): [number, number] {
  const [x1, y1] = points[j];
  const [x2, y2] = points[j + 1];
  return [Math.sign(x2 - x1), Math.sign(y2 - y1)];
}

const toDeg = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;

// 차의 이동 경로를 선으로 그리고, 끝과 꺾이는 곳에 진행 방향 화살표를 둔다.
function PathLines({
  rows,
  cols,
  lines,
  preview,
}: {
  rows: number;
  cols: number;
  lines: SimulatedPath[];
  preview: boolean;
}) {
  const offsets = overlapOffsets(lines);
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      aria-hidden
    >
      {lines.map((line, i) => {
        const { solid } = ROAD_MAKING_COLORS[line.color];
        const offset = offsets[i];
        const points: [number, number][] = line.path.map((p) => [
          p.col + 0.5 + offset,
          p.row + 0.5 + offset,
        ]);
        if (line.exit) {
          // 보드 밖으로 나간 차는 선을 테두리 너머까지 이어 그린다.
          const [x, y] = points[points.length - 1];
          points.push([
            x + line.exit[1] * EXIT_LENGTH,
            y + line.exit[0] * EXIT_LENGTH,
          ]);
        } else if (points.length >= 2) {
          // 사람 칸에서 멈추면 아이콘에 화살촉이 가려지므로 칸 가장자리에서 끝낸다.
          const [dx, dy] = segmentDir(points, points.length - 2);
          const [x, y] = points[points.length - 1];
          points[points.length - 1] = [x - dx * END_INSET, y - dy * END_INSET];
        }
        if (points.length < 2) return null;

        // 화살표는 끝 지점과, 울타리에 막혀 꺾인 직후 구간에만 둔다.
        const lastSeg = points.length - 2;
        const arrows: { x: number; y: number; deg: number }[] = [];
        for (let j = 1; j < lastSeg; j++) {
          const [dx, dy] = segmentDir(points, j);
          const [pdx, pdy] = segmentDir(points, j - 1);
          if (dx === pdx && dy === pdy) continue;
          const [x1, y1] = points[j];
          const [x2, y2] = points[j + 1];
          arrows.push({
            x: (x1 + x2) / 2 + dx * (ARROW_LENGTH / 2),
            y: (y1 + y2) / 2 + dy * (ARROW_LENGTH / 2),
            deg: toDeg(dx, dy),
          });
        }
        const [edx, edy] = segmentDir(points, lastSeg);
        const [tipX, tipY] = points[points.length - 1];
        arrows.push({ x: tipX, y: tipY, deg: toDeg(edx, edy) });

        // 둥근 선 끝이 화살촉 밖으로 삐져나오지 않도록 선을 화살촉 안쪽에서 끝낸다.
        const linePoints = [...points];
        linePoints[linePoints.length - 1] = [
          tipX - edx * ARROW_LENGTH * 0.6,
          tipY - edy * ARROW_LENGTH * 0.6,
        ];
        const opacity = preview ? 0.55 : 0.9;
        const dashed = !preview && !line.reached;

        return (
          <g
            // 경로가 바뀔 때마다 새로 그려지며 살짝 나타나게 한다.
            key={`${line.color}-${i}-${points.join("|")}`}
            style={{ animation: "path-fade 0.3s ease-out both" }}
          >
            <g opacity={opacity}>
              <polyline
                points={linePoints.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="none"
                stroke={solid}
                strokeWidth={preview ? 0.1 : 0.14}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashed ? "0.22 0.16" : undefined}
              />
              {arrows.map((a, j) => (
                <path
                  key={j}
                  d={ARROW_HEAD}
                  fill={solid}
                  strokeLinejoin="round"
                  transform={`translate(${a.x} ${a.y}) rotate(${a.deg})`}
                />
              ))}
            </g>
          </g>
        );
      })}
      <style>{`@keyframes path-fade{from{opacity:0}to{opacity:1}}`}</style>
    </svg>
  );
}
