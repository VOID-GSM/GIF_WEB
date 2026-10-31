// GET /api/users/me 응답. 코인 잔액과 GitHub 연동 정보를 함께 내려준다.
export interface CurrentUserResponse {
  id: number;
  email: string;
  name: string;
  studentNumber: string;
  grade: string | null;
  role: string;
  clientRole: string | null;
  clientTeam: string | null;
  projectId: number | null;
  githubUsername: string | null;
  githubAvatarUrl: string | null;
  coinBalance: number;
}

export interface GithubConnectRequest {
  code: string;
}
