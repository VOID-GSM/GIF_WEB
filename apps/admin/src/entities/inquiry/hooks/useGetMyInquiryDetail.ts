"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyInquiryDetail } from "../api/inquiryApi";

export function useGetMyInquiryDetail(inquiryId: number) {
  return useQuery({
    queryKey: ["inquiry", "my", inquiryId],
    queryFn: () => getMyInquiryDetail(inquiryId),
    enabled: Number.isFinite(inquiryId),
  });
}
