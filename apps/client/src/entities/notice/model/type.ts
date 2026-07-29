// GET /api/notice — 공지 목록
export interface ListNoticeResponse {
  id: number;
  title: string;
  targetGrades: number[];
  targetTeamNames: string[];
  createdAt: string;
}

// GET /api/notice/{noticeId} — 공지 상세
export interface DetailNoticeResponse {
  id: number;
  title: string;
  content: string;
  targetGrades: number[];
  targetTeamNames: string[];
  createdAt: string;
}
