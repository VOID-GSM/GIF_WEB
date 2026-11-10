export const COOKIE_KEYS = {
  ACCESS_TOKEN: "access_token",
} as const;

// 문의 답변·점수 배정 등 일부 권한 판단에 쓰는 운영 계정 (adminRole 기반 권한으로 전환 예정)
export const PRIVILEGED_ADMIN_EMAIL = "teamvoid0107@gmail.com";
