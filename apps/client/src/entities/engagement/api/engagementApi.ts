import { apiClient } from "@repo/lib";

import { getOrCreateVisitorId } from "@/shared/utils";

import {
  COMMENT_PAGE_SIZE,
  type CommentPageResponse,
  type CreateCommentRequest,
  type LikeResponse,
  type ProjectComment,
  type ViewResponse,
} from "../model/types";

// 로그인 사용자는 서버가 헤더를 무시하므로 항상 보낸다.
export const increaseProjectView = async (
  projectId: number,
): Promise<ViewResponse> => {
  const { data } = await apiClient.post<ViewResponse>(
    `/api/project/${projectId}/view`,
    null,
    { headers: { "X-Visitor-Id": getOrCreateVisitorId() } },
  );
  return data;
};

export const likeProject = async (
  projectId: number,
): Promise<LikeResponse> => {
  const { data } = await apiClient.post<LikeResponse>(
    `/api/project/${projectId}/like`,
  );
  return data;
};

export const unlikeProject = async (projectId: number): Promise<LikeResponse> => {
  const { data } = await apiClient.delete<LikeResponse>(
    `/api/project/${projectId}/like`,
  );
  return data;
};

// page 는 1부터 시작, size 최대 50. 최신순.
export const getProjectComments = async (
  projectId: number,
  page = 1,
  size = COMMENT_PAGE_SIZE,
): Promise<CommentPageResponse> => {
  const { data } = await apiClient.get<CommentPageResponse>(
    `/api/project/${projectId}/comments`,
    { params: { page, size } },
  );
  return data;
};

export const createProjectComment = async (
  projectId: number,
  body: CreateCommentRequest,
): Promise<ProjectComment> => {
  const { data } = await apiClient.post<ProjectComment>(
    `/api/project/${projectId}/comments`,
    { content: body.content.trim() },
  );
  return data;
};

export const deleteProjectComment = async (
  projectId: number,
  commentId: number,
): Promise<void> => {
  await apiClient.delete(`/api/project/${projectId}/comments/${commentId}`);
};
