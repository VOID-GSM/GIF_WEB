export interface SignInResponse {
  accessToken: string;
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  grade: string;
  role: string;
  adminRole: string | null;
  adminTeam: string | null;
  clientRole: string | null;
}

export interface GetGoogleCallbackParams {
  code: string;
  state: string;
}

export type GetGoogleCallbackResponse = SignInResponse;
