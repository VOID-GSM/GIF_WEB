import { apiClient } from "@repo/lib";

import type {
  AnswerInquiryRequest,
  DetailInquiryResponse,
  ListInquiryResponse,
  Pageable,
  PageListInquiryResponse,
  PostInquiryRequest,
} from "@/entities/inquiry/model/type";

export const postInquiry = async ({
  title,
  content,
  file,
}: PostInquiryRequest) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (file) formData.append("file", file);

  return apiClient.post<void>("/api/inquiry", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAdminInquiries = async (
  pageable: Pageable,
): Promise<PageListInquiryResponse> => {
  const { data } = await apiClient.get<PageListInquiryResponse>(
    "/api/inquiry/admin",
    { params: pageable },
  );
  return data;
};

export const getAdminInquiryDetail = async (
  inquiryId: number,
): Promise<DetailInquiryResponse> => {
  const { data } = await apiClient.get<DetailInquiryResponse>(
    `/api/inquiry/admin/${inquiryId}`,
  );
  return data;
};

export const answerInquiry = async (
  inquiryId: number,
  body: AnswerInquiryRequest,
): Promise<void> => {
  await apiClient.patch<void>(`/api/inquiry/admin/${inquiryId}/answer`, body);
};

export const getMyInquiries = async (): Promise<ListInquiryResponse[]> => {
  const { data } = await apiClient.get<ListInquiryResponse[]>(
    "/api/inquiry/my",
  );
  return data;
};

export const getMyInquiryDetail = async (
  inquiryId: number,
): Promise<DetailInquiryResponse> => {
  const { data } = await apiClient.get<DetailInquiryResponse>(
    `/api/inquiry/my/${inquiryId}`,
  );
  return data;
};
