import { apiClient } from "@repo/lib";

import type {
  DetailInquiryResponse,
  ListInquiryResponse,
  PostInquiryRequest,
  UpdateInquiryRequest,
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

export const updateInquiry = async ({
  inquiryId,
  title,
  content,
  file,
}: UpdateInquiryRequest) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (file) formData.append("file", file);

  return apiClient.patch<void>(`/api/inquiry/my/${inquiryId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
