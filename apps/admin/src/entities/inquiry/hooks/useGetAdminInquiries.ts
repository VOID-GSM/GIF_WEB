"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminInquiries } from "../api/inquiryApi";
import type { Pageable } from "../model/type";

export function useGetAdminInquiries(pageable: Pageable) {
  return useQuery({
    queryKey: ["inquiry", "admin", pageable],
    queryFn: () => getAdminInquiries(pageable),
  });
}
