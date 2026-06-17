import type { GetMyInfoResponse } from "@/entities/auth/model/types";

export interface UpdateClientInfoRequest {
  name?: string;
  studentNumber?: string;
  clientRole?: string;
}

export type PatchMyInfoResponse = GetMyInfoResponse;
