import { getCookieValue } from "@repo/lib";
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
  const token = getCookieValue("access_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
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
  return fetchWithAuth(`/api/form/submit?submitId=${body.submitId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const postFormUpload = async ({
  formData,
  fieldId,
  submitId,
}: {
  formData: FormData;
  fieldId: number;
  submitId: number; // optional → 필수로 변경
}): Promise<PostFormUploadResponse> => {
  if (USE_MOCK) return "/mock/uploaded-file.pdf";
  const params = new URLSearchParams({
    fieldId: String(fieldId),
    submitId: String(submitId), // 항상 포함
  });
  return fetchWithAuth<PostFormUploadResponse>(
    `/api/form/upload?${params.toString()}`,
    { method: "POST", body: formData },
  );
};

export const deleteFormUpload = async (params: DeleteFormUploadParams) => {
  if (USE_MOCK) return { success: true };
  return fetchWithAuth(
    `/api/form/upload?fieldId=${params.fieldId}&submitId=${params.submitId}`, // submitId 추가
    { method: "DELETE" },
  );
};

export const downloadFile = async (fileUrl: string): Promise<Blob> => {
  const token = getCookieValue("access_token");
  const res = await fetch(fileUrl, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return res.blob();
};
