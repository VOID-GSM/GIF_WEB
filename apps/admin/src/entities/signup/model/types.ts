import type { AdminRole } from "./roles";

export interface PostAdminInfoRequest {
  adminRole: AdminRole;
  gradeHead: boolean; // 학년부 부장 선생님 여부
}
