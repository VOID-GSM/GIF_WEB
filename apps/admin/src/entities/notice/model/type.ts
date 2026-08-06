// POST /api/notice — 공지 등록 (모든 선생님이 작성 가능)
// targetGrades·targetProjectIds가 모두 비어 있으면 전체 공지로 처리된다.
export interface PostNoticeRequest {
  title: string;
  content: string;
  targetGrades: number[];
  targetProjectIds: number[];
}

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
