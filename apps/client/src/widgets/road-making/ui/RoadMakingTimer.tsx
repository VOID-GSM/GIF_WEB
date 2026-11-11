import { ROAD_MAKING_TIME_LIMIT_SECONDS } from "@/entities/assessment";

const format = (seconds: number) => {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function RoadMakingTimer({ remaining }: { remaining: number }) {
  const ratio = Math.min(
    1,
    Math.max(0, remaining / ROAD_MAKING_TIME_LIMIT_SECONDS),
  );
  const urgent = remaining <= 30;

  return (
    <div
      role="timer"
      aria-label={`남은 시간 ${format(remaining)}`}
      className={`flex h-11 items-center gap-3 rounded-full border bg-white py-2 pl-3 pr-4 shadow-sm transition-colors ${
        urgent ? "border-[#ffb3b3]" : "border-gray-300"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-6 -rotate-90" aria-hidden>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="#e9e9e9"
          strokeWidth="3"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke={urgent ? "#ff4d4f" : "#edc926"}
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ratio}
          className="transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
      <span
        className={`min-w-[44px] text-[20px] font-semibold tabular-nums tracking-[-0.5px] ${
          urgent ? "animate-pulse text-[#e5383b]" : "text-gray-900"
        }`}
      >
        {format(remaining)}
      </span>
    </div>
  );
}
