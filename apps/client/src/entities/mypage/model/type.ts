import type { GetMyInfoResponse } from "@/entities/auth/model/types";

export interface UpdateClientInfoRequest {
  name?: string;
  studentNumber?: string;
  clientRole?: string;
}

export type PatchMyInfoResponse = GetMyInfoResponse;

/** 개인 사이트 링크 (최대 5개) */
export interface UserLink {
  id: number;
  title: string | null;
  url: string;
}

/** POST·PATCH /api/users/me/links */
export interface UserLinkRequest {
  title?: string;
  url: string;
}

export interface MypageTeam {
  projectId: number;
  projectName: string;
  teamName: string;
  /** LEADER / MEMBER */
  role: string;
  part: string | null;
}

/** GET /api/users/me/mypage */
export interface MypageResponse {
  id: number;
  name: string;
  email: string;
  /** 업로드한 이미지, 없으면 GitHub 아바타, 둘 다 없으면 null */
  profileImageUrl: string | null;
  /** 직접 업로드한 이미지인지 (삭제 버튼 노출용) */
  customProfileImage: boolean;
  studentNumber: string | null;
  grade: number | null;
  classNo: number | null;
  major: string | null;
  techStacks: string[];
  /** 팀장인 팀이 먼저 온다 */
  teams: MypageTeam[];
  links: UserLink[];
}

/**
 * PATCH /api/users/me/mypage
 * null(미전송) 필드는 유지, major: "" / techStacks: [] 는 삭제
 */
export interface UpdateMypageRequest {
  major?: string;
  techStacks?: string[];
}
