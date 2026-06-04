export interface PostSignupRequest {
  role: string;
  teamName: string;
}

export interface PostSignupResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
}
