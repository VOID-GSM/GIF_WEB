import { apiClient } from "@repo/lib";

import type { PostInquiryRequest } from "@/entities/inquiry/model/type";

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
