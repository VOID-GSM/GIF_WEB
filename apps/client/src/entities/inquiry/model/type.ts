export interface PostInquiryRequest {
  title: string;
  content: string;
  file?: File | null;
}

export type InquiryStatus = "PENDING" | "ANSWERED";

export interface ListInquiryResponse {
  id: number;
  title: string;
  status: InquiryStatus;
  createdByName: string;
  createdAt: string;
}

export interface DetailInquiryResponse {
  id: number;
  title: string;
  content: string;
  filePath?: string;
  originalFileName?: string;
  fileSize?: number;
  status: InquiryStatus;
  answerContent?: string;
  answeredAt?: string;
  createdByName: string;
  createdAt: string;
}
