export interface PostSignInRequest {
  authCode: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface PostSignInResponse {
  accessToken: string;
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
}
