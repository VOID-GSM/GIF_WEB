import { apiClient } from "@repo/lib";

import type {
  AdminCommentPageResponse,
  GetAdminCommentsParams,
} from "@/entities/comment/model/type";

export const getAdminComments = async (
  params: GetAdminCommentsParams,
): Promise<AdminCommentPageResponse> => {
  const { data } = await apiClient.get<AdminCommentPageResponse>(
    "/api/admin/comments",
    { params },
  );
  return data;
};

export const hideComment = async (commentId: number): Promise<void> => {
  await apiClient.patch<void>(`/api/admin/comments/${commentId}/hide`);
};

export const unhideComment = async (commentId: number): Promise<void> => {
  await apiClient.patch<void>(`/api/admin/comments/${commentId}/unhide`);
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/admin/comments/${commentId}`);
};
