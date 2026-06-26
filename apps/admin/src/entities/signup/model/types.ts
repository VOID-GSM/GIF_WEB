import type { AdminRole } from "./roles";

export interface PostAdminInfoRequest {
  adminRole: AdminRole;
  adminTeam?: string; // 담당 팀 없으면 생략
  gradeHead: boolean; // 학년부 부장 선생님 여부
}
