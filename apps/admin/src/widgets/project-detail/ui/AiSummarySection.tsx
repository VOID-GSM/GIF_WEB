"use client";

import { AiSummary } from "@repo/ui";

import { useGetProjectSummary } from "@/entities/project";

interface AiSummarySectionProps {
  projectId: number;
}

// AI 요약 — 관리자 프로젝트 상세에서 AI가 생성한 요약을 보여주는 배너 (디자인 219-215)
export default function AiSummarySection({ projectId }: AiSummarySectionProps) {
  const { data, isLoading } = useGetProjectSummary(projectId);

  // 로딩·내용 없음일 때는 배너를 숨긴다.
  if (isLoading || !data) return null;

  return <AiSummary summary={data} />;
}
