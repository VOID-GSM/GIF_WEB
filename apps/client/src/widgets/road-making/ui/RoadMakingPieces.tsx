import {
  ROAD_MAKING_COLORS,
  type RoadMakingColor,
  type RoadMakingDirection,
} from "@/entities/assessment";

const DIRECTION_DEG: Record<RoadMakingDirection, number> = {
  UP: 0,
  RIGHT: 90,
  DOWN: 180,
  LEFT: 270,
};

export const DIRECTION_LABEL: Record<RoadMakingDirection, string> = {
  UP: "위",
  RIGHT: "오른쪽",
  DOWN: "아래",
  LEFT: "왼쪽",
};

// 위를 보는 자동차와 앞쪽 삼각형 표시를 그린 뒤 통째로 방향만큼 돌린다.
// 차 앞부분과 삼각형이 항상 같은 쪽을 가리키므로 진행 방향을 헷갈리지 않는다.
export function VehiclePiece({
  color,
  direction,
}: {
  color: RoadMakingColor;
  direction: RoadMakingDirection;
}) {
  const { solid, soft } = ROAD_MAKING_COLORS[color];
  return (
    <span
      className="relative block size-full rounded-[22%] border-[2.5px] shadow-[0_2px_0_rgba(0,0,0,0.06)]"
      style={{ borderColor: solid, backgroundColor: soft }}
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 size-full"
        style={{ transform: `rotate(${DIRECTION_DEG[direction]}deg)` }}
        aria-hidden
      >
        {/* 진행 방향 표시 */}
        <path d="M13.5 9 20 2.5 26.5 9z" fill={solid} strokeLinejoin="round" />
        {/* 바퀴 */}
        <rect x="10" y="14" width="4" height="7" rx="1.6" fill="#262626" />
        <rect x="26" y="14" width="4" height="7" rx="1.6" fill="#262626" />
        <rect x="10" y="27" width="4" height="7" rx="1.6" fill="#262626" />
        <rect x="26" y="27" width="4" height="7" rx="1.6" fill="#262626" />
        {/* 차체 */}
        <rect x="12" y="11" width="16" height="26" rx="5.5" fill={solid} />
        {/* 앞유리 */}
        <path
          d="M14.5 19c0-2 1.6-3 5.5-3s5.5 1 5.5 3v2h-11z"
          fill="#fff"
          opacity=".92"
        />
        {/* 헤드라이트 */}
        <circle cx="15.2" cy="13.3" r="1.3" fill="#fff6c7" />
        <circle cx="24.8" cy="13.3" r="1.3" fill="#fff6c7" />
      </svg>
    </span>
  );
}

// 제출 후 각 차가 어떻게 끝났는지 칸 모서리에 붙이는 작은 배지
export function ResultBadge({
  color,
  reached,
}: {
  color: RoadMakingColor;
  reached: boolean;
}) {
  const { solid } = ROAD_MAKING_COLORS[color];
  return (
    <span
      className="flex size-full items-center justify-center rounded-full border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: reached ? solid : "#e5383b" }}
    >
      <svg viewBox="0 0 16 16" className="size-[60%]" aria-hidden>
        {reached ? (
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M4.5 4.5l7 7M11.5 4.5l-7 7"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  );
}

export function PersonPiece({ color }: { color: RoadMakingColor }) {
  const { solid, soft } = ROAD_MAKING_COLORS[color];
  return (
    <span
      className="flex size-full items-center justify-center rounded-full border-[2.5px] shadow-[0_2px_0_rgba(0,0,0,0.06)]"
      style={{ borderColor: solid, backgroundColor: soft }}
    >
      <svg viewBox="0 0 40 40" className="size-[68%]" aria-hidden>
        <circle cx="20" cy="13" r="7" fill={solid} />
        <path d="M7 35c0-7.2 5.8-12 13-12s13 4.8 13 12z" fill={solid} />
        {/* 손 흔드는 팔 */}
        <path
          d="M31 21.5 35 14"
          stroke={solid}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// 칸을 통째로 막는 나무 울타리
export function FencePiece({ ghost = false }: { ghost?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`size-[76%] ${ghost ? "opacity-25" : "drop-shadow-[0_2px_0_rgba(120,72,10,0.25)]"}`}
      aria-hidden
    >
      <rect x="4" y="14" width="32" height="4.5" rx="1.5" fill="#c98a3c" />
      <rect x="4" y="25" width="32" height="4.5" rx="1.5" fill="#c98a3c" />
      {[7, 17, 27].map((x) => (
        <path
          key={x}
          d={`M${x} 34V10.5l3-3.5 3 3.5V34z`}
          fill="#e0a456"
          stroke="#a8692a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
