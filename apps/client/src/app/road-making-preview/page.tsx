"use client";
// 임시 미리보기 (확인 후 삭제)
import { RoadMakingBoard } from "@/widgets/road-making";
import type { RoadMakingVehicle, RoadMakingPerson, RoadMakingVehicleResult } from "@/entities/assessment";

const vehicles: RoadMakingVehicle[] = [
  { color: "YELLOW", position: { row: 1, col: 1 }, direction: "LEFT" },
  { color: "RED", position: { row: 1, col: 5 }, direction: "LEFT" },
  { color: "BLUE", position: { row: 4, col: 0 }, direction: "UP" },
  { color: "PURPLE", position: { row: 3, col: 3 }, direction: "RIGHT" },
];
const people: RoadMakingPerson[] = [
  { color: "YELLOW", position: { row: 1, col: 3 } },
  { color: "RED", position: { row: 1, col: 4 } },
  { color: "BLUE", position: { row: 2, col: 2 } },
  { color: "PURPLE", position: { row: 5, col: 4 } },
];
const fences = new Set(["1-0", "0-0"]);
const results: RoadMakingVehicleResult[] = [
  { color: "YELLOW", path: [{ row: 1, col: 1 }, { row: 0, col: 1 }], reached: false },
  { color: "RED", path: [{ row: 1, col: 5 }, { row: 1, col: 4 }], reached: true },
  { color: "BLUE", path: [{ row: 4, col: 0 }, { row: 3, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }], reached: true },
  { color: "PURPLE", path: [{ row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }], reached: false },
];

export default function Preview() {
  return (
    <div className="grid grid-cols-2 gap-6 bg-white p-6">
      <RoadMakingBoard rows={6} cols={6} vehicles={vehicles} people={people} fences={fences} canPlaceMore={false} disabled={false} results={null} onToggle={() => {}} />
      <RoadMakingBoard rows={6} cols={6} vehicles={vehicles} people={people} fences={fences} canPlaceMore={false} disabled results={results} onToggle={() => {}} />
    </div>
  );
}
