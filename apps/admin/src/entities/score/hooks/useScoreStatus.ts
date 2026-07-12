"use client";

import { useQueries } from "@tanstack/react-query";
import { getMajorScore } from "../api";
import type { ScoreArea } from "../model/areas";
import { toNullOn404 } from "@/shared/utils";

const HIGH_SCORES = [40, 32, 24];
const MEDIUM_SCORES = [25, 20, 15];
const LOW_SCORES = [20, 15, 10];

export interface ScoreStatus {
  scoredAreas: ScoreArea[];
}

// /api/score/major 는 "이 프로젝트의 전공 데이터"가 아니라
// "현재 로그인한 평가자 자신이 제출한 점수 한 행"을 돌려준다(major/report/social 필드 전부 포함).
// 따라서 이 훅은 다른 평가자가 채점했는지는 알 수 없고, 로그인한 계정 본인의 채점 완료 여부만 판단할 수 있다.
export function useScoreStatuses(projectIds: number[]) {
  return useQueries({
    queries: projectIds.map((projectId) => ({
      queryKey: ["score", "status", projectId],
      enabled: projectId > 0,
      staleTime: 5 * 60 * 1000,
      queryFn: async (): Promise<ScoreStatus> => {
        const data = await toNullOn404(() => getMajorScore(projectId).then((r) => r.data))();
        if (!data) return { scoredAreas: [] };
        const majorDone =
          HIGH_SCORES.includes(data.technicalCompleteness) &&
          LOW_SCORES.includes(data.socialValueMajor) &&
          LOW_SCORES.includes(data.aiUtilizationMajor) &&
          LOW_SCORES.includes(data.presentationMajor);
        const reportDone = [
          data.reportWriting,
          data.reportContent,
          data.aiUsagePlan,
          data.creativity,
        ].every((v) => MEDIUM_SCORES.includes(v));
        const socialDone =
          HIGH_SCORES.includes(data.userExperience) &&
          LOW_SCORES.includes(data.socialValueCommunity) &&
          LOW_SCORES.includes(data.aiUtilizationCommunity) &&
          LOW_SCORES.includes(data.presentationCommunity);
        const scoredAreas: ScoreArea[] = [
          ...(majorDone ? (["major"] as ScoreArea[]) : []),
          ...(reportDone ? (["report"] as ScoreArea[]) : []),
          ...(socialDone ? (["social"] as ScoreArea[]) : []),
        ];
        return { scoredAreas };
      },
    })),
  });
}
