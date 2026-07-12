"use client";

import { useQuery } from "@tanstack/react-query";

import { getRank } from "./api";
import type { GetRankParams, RankItem } from "./types";

export function useGetRank({ grade }: GetRankParams) {
  return useQuery<RankItem[]>({
    queryKey: ["rank", grade],
    queryFn: async () => {
      const ranked = await getRank(grade).then((r) => r.data);
      return ranked
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
        .map(({ rank, name, teamName, logo }) => ({ rank, name, teamName, logo }));
    },
  });
}
