import type { AdminRole } from "./roles";

export interface PostAdminInfoRequest {
  adminRole: AdminRole;
  name: string;
  gradeHead: boolean; // 학년부 부장 선생님 여부
}

export interface PostAdminInfoResponse {
  accessToken: string; // 역할이 반영된 새 accessToken
}
