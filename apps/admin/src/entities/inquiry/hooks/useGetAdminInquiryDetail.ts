"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminInquiryDetail } from "../api/inquiryApi";

export function useGetAdminInquiryDetail(inquiryId: number) {
  return useQuery({
    queryKey: ["inquiry", "admin", inquiryId],
    queryFn: () => getAdminInquiryDetail(inquiryId),
    enabled: Number.isFinite(inquiryId),
  });
}
