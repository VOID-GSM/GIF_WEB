export const ROLES = [
  "학년부 부장",
  "보통 교과",
  "전공 교과",
  "아이디어페스티벌 담당",
] as const;

export type Role = (typeof ROLES)[number];
