import { apiClient } from "@repo/lib";

import type {
  DetailNoticeResponse,
  ListNoticeResponse,
  PostNoticeRequest,
} from "../model/type";

export const getNotices = async (): Promise<ListNoticeResponse[]> => {
  const { data } = await apiClient.get<ListNoticeResponse[]>("/api/notice");
  return data;
};

export const getNoticeDetail = async (
  noticeId: number,
): Promise<DetailNoticeResponse> => {
  const { data } = await apiClient.get<DetailNoticeResponse>(
    `/api/notice/${noticeId}`,
  );
  return data;
};

// 생성된 공지의 id를 반환한다.
export const postNotice = async (body: PostNoticeRequest): Promise<number> => {
  const { data } = await apiClient.post<number>("/api/notice", body);
  return data;
};

export const deleteNotice = async (noticeId: number): Promise<void> => {
  await apiClient.delete<void>(`/api/notice/${noticeId}`);
};
