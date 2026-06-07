"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getMajorScore,
  getProjectsByGrade,
  getReportScore,
  getSocialScore,
} from "./api";
import type { GetRankParams, RankItem } from "./types";

export function useGetRank({ grade }: GetRankParams) {
  return useQuery<RankItem[]>({
    queryKey: ["rank", grade],
    queryFn: async () => {
      const projects = await getProjectsByGrade(grade).then((r) => r.data);

      const scored = await Promise.all(
        projects.map(async (project) => {
          const [social, report, major] = await Promise.all([
            getSocialScore(project.id)
              .then((r) => r.data.subTotalScore)
              .catch(() => 0),
            getReportScore(project.id)
              .then((r) => r.data.subTotalScore)
              .catch(() => 0),
            getMajorScore(project.id)
              .then((r) => r.data.subTotalScore)
              .catch(() => 0),
          ]);

          return { teamName: project.teamName, total: social + report + major };
        }),
      );

      return scored
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map((item, index) => ({ rank: index + 1, teamName: item.teamName }));
    },
  });
}
