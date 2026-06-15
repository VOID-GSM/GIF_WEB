import {
  AdminForm,
  AdminSubmitDetail,
  FormDetail,
} from "@/entities/from-management/model/type";
import {
  mockAdminForms,
  mockSubmitDetailMap,
  mockFormDetail,
} from "@/entities/from-management/model/mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// 학년별 팀 목록
export const getAdminForms = async (): Promise<AdminForm[]> => {
  if (USE_MOCK) return mockAdminForms;
  return fetchWithAuth<AdminForm[]>("/api/form/admin");
};

// 양식 상세
export const getFormDetail = async (formId: number): Promise<FormDetail> => {
  if (USE_MOCK) return mockFormDetail[formId];
  return fetchWithAuth<FormDetail>(`/api/form/${formId}`);
};

// 팀 제출 답변
export const getAdminSubmitDetail = async (
  formId: number,
): Promise<AdminSubmitDetail[]> => {
  if (USE_MOCK) return mockSubmitDetailMap[formId] ?? [];
  return fetchWithAuth<AdminSubmitDetail[]>(
    `/api/form/admin/submit?formId=${formId}`,
  );
};
