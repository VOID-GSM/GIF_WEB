import { apiClient } from "../axios";
import type { ScoreRankResponse } from "./types";

export const getRank = (grade: 1 | 2) =>
  apiClient.get<ScoreRankResponse[]>("/api/score/rank", {
    params: { grade },
  });
