import { useQuery } from "@tanstack/react-query";
import { getAdminForms, getAdminSubmitDetail } from "@/entities/from-management/api/api";

export const formKeys = {
  adminForms: (grade?: number) => ["forms", "admin", grade] as const,
  adminSubmitDetail: (formId: number) =>
    ["forms", "admin", "submit", formId] as const,
};

export const useAdminForms = (grade?: number) =>
  useQuery({
    queryKey: formKeys.adminForms(grade),
    queryFn: () => getAdminForms(grade),
  });

export const useAdminSubmitDetail = (formId: number) =>
  useQuery({
    queryKey: formKeys.adminSubmitDetail(formId),
    queryFn: () => getAdminSubmitDetail(formId),
    enabled: !!formId,
  });
