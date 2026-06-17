import { apiClient } from "@repo/lib";
import type { UpdateFormRequest, FormByIdResponse } from "../model/type";
import { mockFormByIdMap, DEFAULT_MOCK_FORM } from "../model/mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const getFormById = async (
  formId: number,
): Promise<{ data: FormByIdResponse }> => {
  if (USE_MOCK) {
    const data = mockFormByIdMap[formId] ?? DEFAULT_MOCK_FORM;
    return { data };
  }

  try {
    return await apiClient.get<FormByIdResponse>(`/api/form/${formId}`);
  } catch {
    // API 실패 시 mock으로 fallback
    const data = mockFormByIdMap[formId] ?? DEFAULT_MOCK_FORM;
    return { data };
  }
};

export const updateForm = async (
  formId: number,
  body: UpdateFormRequest,
): Promise<void> => {
  if (USE_MOCK) return;

  try {
    await apiClient.patch(`/api/form/update`, body, { params: { formId } });
  } catch {
    // mock 환경에서는 저장 실패를 무시하고 성공으로 처리
  }
};
