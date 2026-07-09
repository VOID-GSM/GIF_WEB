"use client";

import { useQuery } from "@tanstack/react-query";

import { getScoreNotice } from "./api";
import type { ScoreNoticeResponse } from "./types";

export function useGetScoreNotice() {
  return useQuery<ScoreNoticeResponse>({
    queryKey: ["score", "notice"],
    queryFn: () => getScoreNotice().then((r) => r.data),
  });
}
