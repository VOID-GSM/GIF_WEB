import type { EngagementFields } from "@/entities/project";

export const COMMENT_MAX_LENGTH = 500;
export const COMMENT_PAGE_SIZE = 20;

// 서버가 필드를 빠뜨릴 수 있어 optional — 캐시에 쓸 때 이전 값으로 폴백한다.
export interface ViewResponse {
  views?: number;
}

export interface LikeResponse {
  liked?: boolean;
  likes?: number;
}

export interface CommentAuthor {
  id: number;
  // 이름이 비어 있는 사용자가 있을 수 있다 (PublicProjectMember.name 과 동일).
  name: string | null;
  profileImage: string | null;
}

export interface ProjectComment {
  id: number;
  author: CommentAuthor;
  content: string;
  /** ISO-8601 instant */
  createdAt: string;
  isMine: boolean;
}

export interface CommentPageResponse {
  content: ProjectComment[];
  totalElements: number;
  hasNext: boolean;
}

export interface CreateCommentRequest {
  content: string;
}

// 프로젝트 상세 캐시(["project","detail",id]) 중 참여 지표 필드
export type ProjectEngagementFields = EngagementFields;
