"use client";

import { useQuery } from "@tanstack/react-query";

import { getNoticeDetail } from "../api";

export function useGetNoticeDetail(noticeId: number) {
  return useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => getNoticeDetail(noticeId),
    enabled: Number.isFinite(noticeId),
  });
}
