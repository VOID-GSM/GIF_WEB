import type { GetMyInfoResponse } from "@/entities/auth/model/types";

export interface UpdateAdminInfoRequest {
  name?: string;
  studentNumber?: string;
  adminRole?: string;
  adminTeam?: string;
}

export type PatchMyInfoResponse = GetMyInfoResponse;
