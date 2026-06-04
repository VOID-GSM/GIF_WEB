export const ROLES = [
  { label: "학년부 부장", value: "GRADE_HEAD" },
  { label: "보통 교과", value: "GENERAL_TEACHER" },
  { label: "전공 교과", value: "MAJOR_TEACHER" },
  { label: "아이디어페스티벌 담당", value: "MASTER" },
] as const;

export type AdminRole = (typeof ROLES)[number]["value"];
