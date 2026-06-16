"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ScoreButton, LabelBadge } from "@repo/ui";
import ScoreTabNav from "./ScoreTabNav";
import {
  useGetMajorScore,
  useGetReportScore,
  useGetSocialScore,
  useCreateMajorScore,
  useUpdateMajorScore,
  useCreateReportScore,
  useUpdateReportScore,
  useCreateSocialScore,
  useUpdateSocialScore,
} from "@/entities/score";
import type {
  CreateMajorScoreRequest,
  CreateReportScoreRequest,
  CreateSocialScoreRequest,
} from "@/entities/score";

type ScoreValue = 40 | 32 | 24;

interface CriterionRow {
  key: string;
  label: string;
  selectedScore: ScoreValue | null;
  isComplete: boolean;
}

const SCORES: ScoreValue[] = [40, 32, 24];

const AREA_LABELS: Record<string, string> = {
  major: "전공 중심 영역",
  report: "보고서 영역",
  social: "사회 중심 영역",
};

const AREA_CRITERIA: Record<string, { key: string; label: string }[]> = {
  major: [
    { key: "technicalCompleteness", label: "기술 완성도" },
    { key: "socialValueMajor",      label: "사회적 가치" },
    { key: "aiUtilityMajorScore",   label: "AI 활용" },
    { key: "presentationMajor",     label: "발표" },
  ],
  report: [
    { key: "reportWriting", label: "보고서 작성" },
    { key: "reportContent", label: "보고서 내용" },
    { key: "aiUsagePlan",   label: "AI 활용 계획" },
    { key: "creativity",    label: "창의성" },
  ],
  social: [
    { key: "userExperience",         label: "사용자 경험" },
    { key: "socialValueCommunity",   label: "사회적 가치" },
    { key: "aiUtilizationCommunity", label: "AI 활용" },
    { key: "presentationCommunity",  label: "발표" },
  ],
};

// GET 응답 필드명 → 요청 필드명 매핑 (major 영역 AI 활용 필드명 불일치)
const RESPONSE_TO_REQUEST_KEY: Record<string, string> = {
  aiUtilizationMajor: "aiUtilityMajorScore",
};

function normalizeKey(key: string): string {
  return RESPONSE_TO_REQUEST_KEY[key] ?? key;
}

interface Props {
  area: string;
  projectId: number;
  teamName: string;
}

export default function ScoreAreaView({ area, projectId, teamName }: Props) {
  const router = useRouter();
  const criteria = useMemo(() => AREA_CRITERIA[area] ?? [], [area]);

  const majorQuery  = useGetMajorScore(area === "major"  ? projectId : 0);
  const reportQuery = useGetReportScore(area === "report" ? projectId : 0);
  const socialQuery = useGetSocialScore(area === "social" ? projectId : 0);

  const query =
    area === "major"  ? majorQuery  :
    area === "report" ? reportQuery :
    socialQuery;

  const existingScore = query.data ?? null;
  const isQueryLoading = query.isLoading;

  const createMajor  = useCreateMajorScore();
  const updateMajor  = useUpdateMajorScore();
  const createReport = useCreateReportScore();
  const updateReport = useUpdateReportScore();
  const createSocial = useCreateSocialScore();
  const updateSocial = useUpdateSocialScore();

  const isMutating =
    createMajor.isPending || updateMajor.isPending ||
    createReport.isPending || updateReport.isPending ||
    createSocial.isPending || updateSocial.isPending;

  const [localScores,   setLocalScores]   = useState<Record<string, ScoreValue | null>>({});
  const [localComplete, setLocalComplete] = useState<Record<string, boolean>>({});

  const rows = useMemo<CriterionRow[]>(() =>
    criteria.map((c) => {
      const serverScore = (() => {
        if (!existingScore) return null;
        const responseKey =
          Object.keys(existingScore).find((k) => normalizeKey(k) === c.key) ?? c.key;
        const raw = (existingScore as unknown as Record<string, number>)[responseKey] ?? null;
        return (raw === 40 || raw === 32 || raw === 24 ? raw : null) as ScoreValue | null;
      })();
      const selectedScore = c.key in localScores ? localScores[c.key] : serverScore;
      const isComplete    = c.key in localComplete ? localComplete[c.key] : serverScore !== null;
      return { ...c, selectedScore, isComplete };
    }),
    [criteria, existingScore, localScores, localComplete],
  );

  const completed = rows.filter((r) => r.isComplete).length;
  const pending   = rows.filter((r) => !r.isComplete).length;

  function selectScore(key: string, score: ScoreValue) {
    setLocalScores((prev) => ({
      ...prev,
      [key]: prev[key] === score ? null : score,
    }));
  }

  function toggleComplete(key: string) {
    const row = rows.find((r) => r.key === key);
    if (!row || row.selectedScore === null) return;
    setLocalComplete((prev) => ({ ...prev, [key]: !row.isComplete }));
  }

  function buildBody() {
    const get = (key: string) => rows.find((r) => r.key === key)?.selectedScore ?? 0;
    if (area === "major") {
      return {
        projectId,
        technicalCompleteness: get("technicalCompleteness"),
        socialValueMajor:      get("socialValueMajor"),
        aiUtilityMajorScore:   get("aiUtilityMajorScore"),
        presentationMajor:     get("presentationMajor"),
      } satisfies CreateMajorScoreRequest;
    }
    if (area === "report") {
      return {
        projectId,
        reportWriting: get("reportWriting"),
        reportContent: get("reportContent"),
        aiUsagePlan:   get("aiUsagePlan"),
        creativity:    get("creativity"),
      } satisfies CreateReportScoreRequest;
    }
    return {
      projectId,
      userExperience:          get("userExperience"),
      socialValueCommunity:    get("socialValueCommunity"),
      aiUtilizationCommunity:  get("aiUtilizationCommunity"),
      presentationCommunity:   get("presentationCommunity"),
    } satisfies CreateSocialScoreRequest;
  }

  function handleSave() {
    const body = buildBody();
    if (existingScore) {
      if (area === "major")  updateMajor.mutate(body as CreateMajorScoreRequest);
      else if (area === "report") updateReport.mutate(body as CreateReportScoreRequest);
      else updateSocial.mutate(body as CreateSocialScoreRequest);
    } else {
      if (area === "major")  createMajor.mutate(body as CreateMajorScoreRequest);
      else if (area === "report") createReport.mutate(body as CreateReportScoreRequest);
      else createSocial.mutate(body as CreateSocialScoreRequest);
    }
  }

  const allScored = rows.every((r) => r.selectedScore !== null);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
      <div className="w-full max-w-[980px] mx-auto flex flex-col gap-1">
        <ScoreTabNav />
        <button
          onClick={() => router.back()}
          className="text-lg font-semibold text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-2 mt-1 w-fit"
        >
          ← 뒤로
        </button>
        <p className="text-sm text-gray-500">
          {AREA_LABELS[area] ?? area} — {teamName}
        </p>
      </div>

      <div className="flex gap-3 sm:gap-4 w-full max-w-[980px] mx-auto">
        {[
          { label: "전체 항목", value: rows.length },
          { label: "평가 완료", value: completed },
          { label: "평가 대기", value: pending },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex-1 bg-white rounded-xl border border-gray-200 shadow-new px-4 sm:px-6 py-4"
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
            <p className="leading-none">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">{value}</span>
              <span className="text-sm text-gray-400 ml-1">/ {rows.length}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[980px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
        {isQueryLoading ? (
          <p className="py-10 text-center text-gray-400">불러오는 중...</p>
        ) : (
          <>
            {/* 모바일: 항목별 카드 레이아웃 */}
            <div className="sm:hidden divide-y divide-[var(--color-gray-100)]">
              {rows.map((row) => (
                <div key={row.key} className="py-3 flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-800">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      {SCORES.map((score) => (
                        <ScoreButton
                          key={score}
                          score={score}
                          variant={row.selectedScore === score ? "active" : "inactive"}
                          onClick={() => {
                            if (!row.isComplete) selectScore(row.key, score);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => toggleComplete(row.key)}
                      className="ml-auto w-fit cursor-pointer"
                      disabled={row.selectedScore === null}
                    >
                      <LabelBadge
                        status={row.isComplete ? "complete" : "edit"}
                        variant={row.isComplete ? "active" : "inactive"}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* sm 이상: 그리드 테이블 레이아웃 */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <div className="grid grid-cols-[1fr_180px_80px] gap-4 px-4 py-2.5 bg-orange-50 border-b border-t border-orange-400 min-w-[460px]">
                {["평가 항목", "점수", "작업"].map((h) => (
                  <span key={h} className="font-semibold text-gray-700 text-sm">
                    {h}
                  </span>
                ))}
              </div>
              <div className="divide-y divide-[var(--color-gray-100)] min-w-[460px]">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="grid grid-cols-[1fr_180px_80px] gap-4 px-4 py-3 items-center"
                  >
                    <span className="text-sm font-medium text-gray-800">{row.label}</span>
                    <div className="flex gap-1.5">
                      {SCORES.map((score) => (
                        <ScoreButton
                          key={score}
                          score={score}
                          variant={row.selectedScore === score ? "active" : "inactive"}
                          onClick={() => {
                            if (!row.isComplete) selectScore(row.key, score);
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => toggleComplete(row.key)}
                      className="w-fit cursor-pointer"
                      disabled={row.selectedScore === null}
                    >
                      <LabelBadge
                        status={row.isComplete ? "complete" : "edit"}
                        variant={row.isComplete ? "active" : "inactive"}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!isQueryLoading && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={!allScored || isMutating}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isMutating ? "저장 중..." : existingScore ? "수정 저장" : "점수 저장"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
