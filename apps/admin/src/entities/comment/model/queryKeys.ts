import type { GetAdminCommentsParams } from "./type";

export const commentQueryKeys = {
  all: ["admin-comments"] as const,
  list: (params: GetAdminCommentsParams) =>
    [
      "admin-comments",
      params.projectId ?? "all",
      params.userId ?? "all",
      params.page,
      params.size,
    ] as const,
};

// 숨김·숨김 해제·삭제 mutation 공통 prefix — 처리 중인 댓글을 찾을 때 쓴다.
export const commentMutationKeys = {
  all: ["admin-comments", "moderate"] as const,
  hide: ["admin-comments", "moderate", "hide"] as const,
  unhide: ["admin-comments", "moderate", "unhide"] as const,
  delete: ["admin-comments", "moderate", "delete"] as const,
};
