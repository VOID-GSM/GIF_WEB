export interface PostSignInRequest {
  authCode: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface SignInResponse {
  accessToken: string;
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
  adminRole: string | null;
  adminTeam: string | null;
  clientRole: string | null;
  clientTeam: string | null;
}

export type PostSignInResponse = SignInResponse;

export interface GetDgCallbackParams {
  code: string;
  state: string;
}

export type GetDgCallbackResponse = SignInResponse;

export interface GetMyInfoResponse {
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
  adminRole: string | null;
  adminTeam: string | null;
  clientRole: string | null;
  clientTeam: string | null;
}

export type GetMeResponse = Omit<SignInResponse, "accessToken">;
