// GET /api/admin/comments — 관리자용 댓글 (숨김 포함, 삭제 제외)
export interface AdminComment {
  id: number;
  projectId: number;
  userId: number;
  authorName: string;
  content: string;
  createdAt: string; // UTC ISO-8601
  hidden: boolean;
}

export interface AdminCommentPageResponse {
  content: AdminComment[];
  totalElements: number;
  hasNext: boolean;
}

export interface GetAdminCommentsParams {
  projectId?: number;
  userId?: number;
  page: number; // 1부터
  size: number; // 1~50
}
