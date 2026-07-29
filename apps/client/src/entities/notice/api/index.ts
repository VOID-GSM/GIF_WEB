import { apiClient } from "@repo/lib";

import type {
  DetailNoticeResponse,
  ListNoticeResponse,
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
