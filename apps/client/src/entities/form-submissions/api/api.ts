import type {
  PostFormSubmitRequest,
  PatchFormSubmitRequest,
  DeleteFormUploadParams,
  GetFormMySubmitParams,
  GetFormMySubmitResponse,
  PostFormUploadResponse,
  GetFormDetailResponse,
} from "../model/types";
import { mockMySubmit, mockFormDetail } from "../model/mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const getFormDetail = async (
  formId: number,
): Promise<GetFormDetailResponse> => {
  if (USE_MOCK) return mockFormDetail;
  return fetchWithAuth<GetFormDetailResponse>(`/api/form/${formId}`);
};

export const getFormMySubmit = async (
  params: GetFormMySubmitParams,
): Promise<GetFormMySubmitResponse> => {
  if (USE_MOCK) return mockMySubmit;
  return fetchWithAuth<GetFormMySubmitResponse>(
    `/api/form/my-submit?formId=${params.formId}&projectId=${params.projectId}`,
  );
};

export const postFormSubmit = async (body: PostFormSubmitRequest) => {
  if (USE_MOCK) return 1; // submitId mock
  return fetchWithAuth<number>(`/api/form/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const patchFormSubmit = async (body: PatchFormSubmitRequest) => {
  if (USE_MOCK) return { success: true };
  return fetchWithAuth(`/api/form/submit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const postFormUpload = async (
  formData: FormData,
): Promise<PostFormUploadResponse> => {
  if (USE_MOCK) return { fileUrl: "/mock/uploaded-file.pdf" };
  return fetchWithAuth<PostFormUploadResponse>(`/api/form/upload`, {
    method: "POST",
    body: formData,
    // Content-Type 헤더 제거 — FormData는 브라우저가 자동으로 설정
  });
};

export const deleteFormUpload = async (params: DeleteFormUploadParams) => {
  if (USE_MOCK) return { success: true };
  return fetchWithAuth(
    `/api/form/upload?submitId=${params.submitId}&fieldId=${params.fieldId}`,
    { method: "DELETE" },
  );
};
