import type { RoadMakingColor } from "./types";

// 서버 RoadMakingService.TIME_LIMIT
export const ROAD_MAKING_TIME_LIMIT_SECONDS = 5 * 60;

// solid: 아이콘·경로, soft: 칸 배경, label: 스크린리더용 이름
export const ROAD_MAKING_COLORS: Record<
  RoadMakingColor,
  { solid: string; soft: string; label: string }
> = {
  RED: { solid: "#ff4d4f", soft: "#ffe3e3", label: "빨간" },
  BLUE: { solid: "#2f8cff", soft: "#dcecff", label: "파란" },
  GREEN: { solid: "#3fb34f", soft: "#dcf5df", label: "초록" },
  YELLOW: { solid: "#e5b800", soft: "#fff6c7", label: "노란" },
  PURPLE: { solid: "#8b5cf6", soft: "#ece4ff", label: "보라" },
  ORANGE: { solid: "#ff8900", soft: "#ffeacc", label: "주황" },
};
