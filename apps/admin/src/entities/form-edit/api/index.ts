import { apiClient, getCookieValue } from "@repo/lib";
import type { UpdateFormRequest, FormByIdResponse } from "../model/type";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFormById = async (
  formId: number,
  projectId?: number,
): Promise<FormByIdResponse> => {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const token = getCookieValue("access_token");
  const query = projectId ? `?projectId=${projectId}` : "";
  const res = await fetch(`${BASE_URL}/api/form/${formId}${query}`, {
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

export const updateForm = async (
  formId: number,
  body: UpdateFormRequest,
): Promise<void> => {
  await apiClient.patch(`/api/form/update`, body, { params: { formId } });
};
