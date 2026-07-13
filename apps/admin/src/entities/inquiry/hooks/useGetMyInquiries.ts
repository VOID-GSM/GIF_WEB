"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyInquiries } from "../api/inquiryApi";

export function useGetMyInquiries() {
  return useQuery({
    queryKey: ["inquiry", "my"],
    queryFn: getMyInquiries,
  });
}
