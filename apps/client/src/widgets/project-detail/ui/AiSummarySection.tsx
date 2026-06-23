"use client";

import { AiSummary } from "@repo/ui";

import { useGetProjectSummary } from "@/entities/project";

interface AiSummarySectionProps {
  projectId: number;
  // 내 프로젝트가 아닐 때만 노출 (다른 팀 프로젝트 요약)
  enabled?: boolean;
}

// AI 요약 — 다른 팀 프로젝트 상세에서 AI가 생성한 요약을 보여주는 배너 (디자인 219-215)
export default function AiSummarySection({
  projectId,
  enabled = true,
}: AiSummarySectionProps) {
  const { data, isLoading } = useGetProjectSummary(projectId, { enabled });

  // 비활성·로딩·내용 없음일 때는 배너를 숨긴다.
  if (!enabled || isLoading || !data) return null;

  return <AiSummary summary={data} />;
}
