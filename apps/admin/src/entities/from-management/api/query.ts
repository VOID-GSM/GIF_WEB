import { useQuery } from "@tanstack/react-query";
import {
  getAdminForms,
  getFormDetail,
  getAdminSubmitDetail,
} from "@/entities/from-management/api/api";

export const formKeys = {
  adminForms: () => ["forms", "admin"] as const,
  formDetail: (formId: number) => ["forms", "detail", formId] as const,
  adminSubmitDetail: (formId: number) =>
    ["forms", "admin", "submit", formId] as const,
};

// 학년별 팀 목록 페이지
export const useAdminForms = () =>
  useQuery({
    queryKey: formKeys.adminForms(),
    queryFn: getAdminForms,
  });

// 팀 제출 상세 페이지
export const useFormDetail = (formId: number) =>
  useQuery({
    queryKey: formKeys.formDetail(formId),
    queryFn: () => getFormDetail(formId),
    enabled: !!formId,
  });

export const useAdminSubmitDetail = (formId: number) =>
  useQuery({
    queryKey: formKeys.adminSubmitDetail(formId),
    queryFn: () => getAdminSubmitDetail(formId),
    enabled: !!formId,
  });
