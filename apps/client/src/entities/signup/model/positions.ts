export const POSITIONS = [
  { label: "팀장", value: "LEADER" },
  { label: "팀원", value: "MEMBER" },
] as const;

export type ClientRole = (typeof POSITIONS)[number]["value"];
