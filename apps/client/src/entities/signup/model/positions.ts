export const POSITIONS = [
  // 라벨은 번역 리소스(auth.position.<value>)에 있다.
  { value: "LEADER" },
  { value: "MEMBER" },
] as const;

export type ClientRole = (typeof POSITIONS)[number]["value"];
