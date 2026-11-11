// 계정 유형 — 교내 OAuth 는 STUDENT/TEACHER, Google 로그인은 EXTERNAL(외부 사용자)
export const ACCOUNT_TYPES = ["STUDENT", "TEACHER", "EXTERNAL"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const isAccountType = (value: unknown): value is AccountType =>
  (ACCOUNT_TYPES as readonly unknown[]).includes(value);

// 같은 /callback 으로 돌아오는 OAuth 제공자
export type OAuthProvider = "dg" | "google";

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
  accountType: AccountType | null;
  adminRole: string | null;
  adminTeam: string | null;
  clientRole: string | null;
  clientTeam: string | null;
  // 로그인 시작 시 넘긴 복귀 경로 (서버에서 검증, 없으면 null)
  returnTo: string | null;
}

export type PostSignInResponse = SignInResponse;

export interface GetDgCallbackParams {
  code: string;
  state: string;
}

export type GetDgCallbackResponse = SignInResponse;

export type GetGoogleCallbackParams = GetDgCallbackParams;
export type GetGoogleCallbackResponse = SignInResponse;

export interface GetOAuthCallbackParams extends GetDgCallbackParams {
  provider: OAuthProvider;
}

export interface GetMyInfoResponse {
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
  accountType: AccountType | null;
  adminRole: string | null;
  adminTeam: string | null;
  clientRole: string | null;
  clientTeam: string | null;
  projectId: number;
}

export type GetMeResponse = Omit<SignInResponse, "accessToken" | "returnTo"> & {
  coinBalance: number;
};
