import type { AdminRole } from "./roles";

export interface PatchAdminInfoRequest {
  adminRole: AdminRole;
  adminTeam: string;
}
