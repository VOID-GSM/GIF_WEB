import { apiClient } from "@repo/lib";

import type { PostInquiryRequest } from "@/entities/inquiry/model/type";

// 파일을 base64 데이터 URL 문자열로 변환한다.
// (Swagger 계약상 body 는 application/json 이며 file 은 string 필드다.)
const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const postInquiry = async ({
  title,
  content,
  file,
}: PostInquiryRequest) => {
  const params = new URLSearchParams({ title, content });
  const body = { file: file ? await fileToBase64(file) : null };

  return apiClient.post<void>(`/api/inquiry?${params}`, body);
};
