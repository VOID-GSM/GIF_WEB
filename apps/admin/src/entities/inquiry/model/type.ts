export interface PostInquiryRequest {
  title: string;
  content: string;
  file?: File | null;
}

export type InquiryStatus = "PENDING" | "ANSWERED";

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface ListInquiryResponse {
  id: number;
  title: string;
  status: InquiryStatus;
  createdByName: string;
  createdAt: string;
}

export interface PageListInquiryResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ListInquiryResponse[];
  number: number;
  numberOfElements: number;
  empty: boolean;
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

export interface AnswerInquiryRequest {
  answerContent: string;
}
