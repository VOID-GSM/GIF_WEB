import { apiClient } from "../axios";
import type { ScoreRankResponse, ScoreNoticeResponse } from "./types";

export const getRank = (grade: 1 | 2) =>
  apiClient.get<ScoreRankResponse[]>("/api/score/rank", {
    params: { grade },
  });

export const getScoreNotice = () =>
  apiClient.get<ScoreNoticeResponse>("/api/score/notice");
