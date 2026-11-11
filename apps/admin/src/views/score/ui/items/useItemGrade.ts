"use client";

import { useMemo, useState } from "react";
import { useGetProjectItemScores, useSaveProjectItemScores } from "@/entities/score";
import type { ProjectAreaScore } from "@/entities/score";

export interface GradeItemRow {
  id: number;
  name: string;
  criteria: string | null;
  options: number[];
  /** 서버에 저장된 점수 (미채점 null) */
  savedScore: number | null;
  /** 화면에서 선택된 점수 (변경 중이면 변경값) */
  selectedScore: number | null;
  isChanged: boolean;
}

export interface GradeAreaSection {
  id: number;
  name: string;
  totalScore: number;
  totalMaxScore: number;
  items: GradeItemRow[];
}

interface Params {
  projectId: number;
  enabled: boolean;
}

export function useItemGrade({ projectId, enabled }: Params) {
  const { data, isLoading, isError } = useGetProjectItemScores(projectId, { enabled });
  const { mutate: saveScores, isPending: isSaving } = useSaveProjectItemScores();
  // 저장 전까지 바꾼 점수만 들고 있는다 (itemId → score).
  const [draft, setDraft] = useState<Record<number, number>>({});

  const sections: GradeAreaSection[] = useMemo(
    () =>
      (data?.areas ?? []).map((area: ProjectAreaScore) => {
        const items = area.items.map((item) => {
          const draftScore = draft[item.id];
          const selectedScore = draftScore ?? item.score;
          return {
            id: item.id,
            name: item.name,
            criteria: item.criteria,
            options: item.options,
            savedScore: item.score,
            selectedScore,
            isChanged: draftScore !== undefined && draftScore !== item.score,
          };
        });
        return {
          id: area.id,
          name: area.name,
          totalScore: items.reduce((sum, i) => sum + (i.selectedScore ?? 0), 0),
          totalMaxScore: area.totalMaxScore,
          items,
        };
      }),
    [data, draft],
  );

  const allItems = sections.flatMap((s) => s.items);
  // 선택지가 없는 항목은 채점할 수 없으므로 진행률에서 뺀다.
  const gradableItems = allItems.filter((i) => i.options.length > 0);
  const changedItems = allItems.filter((i) => i.isChanged);
  const scoredCount = gradableItems.filter((i) => i.selectedScore !== null).length;
  const totalScore = sections.reduce((sum, s) => sum + s.totalScore, 0);

  function selectScore(itemId: number, score: number) {
    setDraft((prev) => ({ ...prev, [itemId]: score }));
  }

  function resetDraft() {
    setDraft({});
  }

  function save() {
    if (changedItems.length === 0) return;
    saveScores(
      {
        projectId,
        scores: changedItems.map((i) => ({ itemId: i.id, score: i.selectedScore as number })),
      },
      // 응답으로 캐시가 교체되므로 로컬 변경분은 비운다.
      { onSuccess: resetDraft },
    );
  }

  return {
    sections,
    isLoading,
    isError,
    isSaving,
    totalScore,
    totalMaxScore: data?.totalMaxScore ?? 0,
    gradableCount: gradableItems.length,
    scoredCount,
    changedCount: changedItems.length,
    selectScore,
    resetDraft,
    save,
  };
}
