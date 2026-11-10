// 서버 정렬 기준 — VIEWS(조회수순, 기본) / LIKES(좋아요순)
export type ProjectStatsSort = "VIEWS" | "LIKES";

export interface GetProjectStatsParams {
  grade?: number;
  classNo?: number;
  sort: ProjectStatsSort;
}

// GET /api/project/stats — 프로젝트별 조회수·좋아요·댓글 수
export interface ProjectStats {
  projectId: number;
  name: string;
  teamName: string;
  grade: number | null;
  classNo: number | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}
