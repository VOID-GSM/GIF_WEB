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

// 첨부파일은 인증이 필요한 엔드포인트이므로 apiClient(Authorization 헤더 자동 첨부)로
// Blob을 받아 다운로드한다. filePath가 절대 URL이면 axios가 baseURL을 무시하고 그대로 사용한다.
export const downloadInquiryFile = async (fileUrl: string): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>(fileUrl, {
    responseType: "blob",
  });
  return data;
};
