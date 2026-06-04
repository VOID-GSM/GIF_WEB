export interface PostSignupRequest {
  position: string;
}

export interface PostSignupResponse {
  userId: number;
  email: string;
  name: string;
  studentNumber: string;
  role: string;
}
