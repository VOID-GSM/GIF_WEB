import type { AdminRole } from "./roles";

export interface PostAdminInfoRequest {
  adminRole: AdminRole;
  adminTeam: string;
}
