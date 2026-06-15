export interface UpdateClientInfoRequest {
  name?: string;
  studentNumber?: string;
  clientRole?: string;
}

export interface PatchMyInfoResponse {
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
  adminRole: string;
  adminTeam: string;
  clientRole: string;
}
