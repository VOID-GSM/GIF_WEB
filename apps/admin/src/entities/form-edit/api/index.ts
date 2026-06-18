import { apiClient, getCookieValue } from "@repo/lib";
import type { UpdateFormRequest, FormByIdResponse } from "../model/type";
import { mockFormByIdMap, DEFAULT_MOCK_FORM } from "../model/mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const token = getCookieValue("access_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// TODO: GET /api/form/{formId} 는 ROLE_STUDENT 전용일 수 있음
// 백엔드에서 ROLE_ADMIN 권한 추가 후 아래 mock fallback 제거
export const getFormById = async (
  formId: number,
): Promise<{ data: FormByIdResponse }> => {
  if (USE_MOCK) {
    const data = mockFormByIdMap[formId] ?? DEFAULT_MOCK_FORM;
    return { data };
  }

  try {
    const data = await fetchWithAuth<FormByIdResponse>(`/api/form/${formId}`);
    return { data };
  } catch {
    // 403/404 등 실패 시 mock fallback (백엔드 권한 정비 전 임시)
    const data = mockFormByIdMap[formId] ?? DEFAULT_MOCK_FORM;
    return { data };
  }
};

export const updateForm = async (
  formId: number,
  body: UpdateFormRequest,
): Promise<void> => {
  if (USE_MOCK) return;
  await apiClient.patch(`/api/form/update`, body, { params: { formId } });
};
