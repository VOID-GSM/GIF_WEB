import type { RankItem } from "./types";

export const RANK_MOCK_DATA: Record<1 | 2, RankItem[]> = {
  1: [
    { rank: 1, teamName: "TEAM A" },
    { rank: 2, teamName: "TEAM B" },
    { rank: 3, teamName: "TEAM C" },
    { rank: 4, teamName: "TEAM D" },
    { rank: 5, teamName: "TEAM E" },
  ],
  2: [
    { rank: 1, teamName: "VOID" },
    { rank: 2, teamName: "BETA" },
    { rank: 3, teamName: "GAMMA" },
    { rank: 4, teamName: "DELTA" },
    { rank: 5, teamName: "SIGMA" },
    { rank: 6, teamName: "OMEGA" },
  ],
};
