export const POSITIONS = ["팀장", "팀원"] as const;

export type Position = (typeof POSITIONS)[number];
