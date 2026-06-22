import { getCookieValue } from "@repo/lib";
import {
  AdminForm,
  AdminFormDetail,
  AdminSubmitDetail,
} from "@/entities/from-management/model/type";
import {
  mockAdminForms,
  mockFormDetailMap,
  mockSubmitDetailMap,
} from "@/entities/from-management/model/mock";

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
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// 학년별 양식 목록
export const getAdminForms = async (grade?: number): Promise<AdminForm[]> => {
  if (USE_MOCK) {
    return grade
      ? mockAdminForms.filter((f) => f.targetGrade === grade)
      : mockAdminForms;
  }
  const query = grade ? `?grade=${grade}` : "";
  return fetchWithAuth<AdminForm[]>(`/api/form/admin${query}`);
};

// 양식 단건 조회 (제출 상세보기용 — announced 양식도 조회 가능)
export const getAdminFormDetail = async (
  formId: number,
): Promise<AdminFormDetail> => {
  if (USE_MOCK) {
    const detail = mockFormDetailMap[formId];
    if (!detail) throw new Error(`Mock form ${formId} not found`);
    return detail;
  }
  return fetchWithAuth<AdminFormDetail>(`/api/form/${formId}`);
};

// 양식별 전체 제출 답변 (formId = 템플릿 ID)
export const getAdminSubmitDetail = async (
  formId: number,
): Promise<AdminSubmitDetail[]> => {
  if (USE_MOCK) return mockSubmitDetailMap[formId] ?? [];
  return fetchWithAuth<AdminSubmitDetail[]>(
    `/api/form/admin/submit?formId=${formId}`,
  );
};
