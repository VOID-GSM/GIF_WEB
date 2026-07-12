"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../axios";
import { getRank } from "./api";
import type { GetRankParams, RankItem, RankProjectResponse } from "./types";

export function useGetRank({ grade }: GetRankParams) {
  return useQuery<RankItem[]>({
    queryKey: ["rank", grade],
    queryFn: async () => {
      const [ranked, projects] = await Promise.all([
        getRank(grade).then((r) => r.data),
        apiClient
          .get<RankProjectResponse[]>("/api/project/filter", { params: { grade } })
          .then((r) => r.data)
          .catch(() => []),
      ]);
      const projectByTeamName = new Map(projects.map((project) => [project.teamName, project]));
      return ranked
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
        .map((item) => {
          const project = projectByTeamName.get(item.teamName);
          return {
            rank: item.rank,
            name: item.name,
            teamName: item.teamName,
            logo:
              item.logo ??
              item.projectLogo ??
              item.teamLogo ??
              item.thumbnailUrl ??
              project?.logo ??
              null,
          };
        });
    },
  });
}
