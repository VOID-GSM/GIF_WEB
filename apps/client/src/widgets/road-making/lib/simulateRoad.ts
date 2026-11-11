import type {
  BoardPosition,
  RoadMakingDirection,
  RoadMakingPerson,
  RoadMakingVehicle,
} from "@/entities/assessment";

export const cellKey = (row: number, col: number) => `${row}-${col}`;

export const DIRECTION_DELTA: Record<RoadMakingDirection, [number, number]> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
};

export const CLOCKWISE: RoadMakingDirection[] = ["UP", "RIGHT", "DOWN", "LEFT"];

const turnRight = (dir: RoadMakingDirection) =>
  CLOCKWISE[(CLOCKWISE.indexOf(dir) + 1) % 4];

export interface SimulatedPath {
  color: RoadMakingVehicle["color"];
  // 출발 칸부터 멈춘 칸까지
  path: BoardPosition[];
  reached: boolean;
  // 보드 밖으로 나갔다면 나간 방향
  exit: [number, number] | null;
}

// 서버 규칙과 같다: 화살표 방향으로 직진하고, 앞이 울타리면 시계 방향으로 돈다.
// 처음 닿는 사람에서 멈추고, 다른 차는 그냥 지나간다.
export function simulateVehicle(
  vehicle: RoadMakingVehicle,
  // cellKey → 그 칸의 사람
  personAt: Map<string, RoadMakingPerson>,
  fences: Set<string>,
  rows: number,
  cols: number,
): SimulatedPath {
  const path: BoardPosition[] = [vehicle.position];
  const visited = new Set<string>();
  let { row, col } = vehicle.position;
  let dir = vehicle.direction;

  for (;;) {
    // 같은 칸을 같은 방향으로 다시 지나면 영원히 돈다.
    const state = `${row}-${col}-${dir}`;
    if (visited.has(state)) break;
    visited.add(state);

    let turns = 0;
    let [dr, dc] = DIRECTION_DELTA[dir];
    while (turns < 4 && fences.has(cellKey(row + dr, col + dc))) {
      dir = turnRight(dir);
      [dr, dc] = DIRECTION_DELTA[dir];
      turns++;
    }
    // 사방이 울타리로 막혔다.
    if (turns === 4) break;

    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
      return { color: vehicle.color, path, reached: false, exit: [dr, dc] };
    }

    row = nr;
    col = nc;
    path.push({ row, col });
    const person = personAt.get(cellKey(row, col));
    if (person) {
      return {
        color: vehicle.color,
        path,
        reached: person.color === vehicle.color,
        exit: null,
      };
    }
  }

  return { color: vehicle.color, path, reached: false, exit: null };
}
