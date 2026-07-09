import { useState, useMemo } from "react";
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
import { AREA_CRITERIA, RESPONSE_TO_REQUEST_KEY } from "./constants";
import type { ScoreValue, CriterionRow } from "./constants";
import type { DetailScoreResponse } from "@/entities/score";

function normalizeKey(key: string): string {
  return RESPONSE_TO_REQUEST_KEY[key] ?? key;
}

// 채점 기준 필드 전체 (영역 무관) — 레코드 존재 여부 판정에 사용
const SCORE_CRITERION_KEYS = [
  "technicalCompleteness",
  "socialValueMajor",
  "aiUtilizationMajor",
  "presentationMajor",
  "reportWriting",
  "reportContent",
  "aiUsagePlan",
  "creativity",
  "userExperience",
  "socialValueCommunity",
  "aiUtilizationCommunity",
  "presentationCommunity",
] as const satisfies readonly (keyof DetailScoreResponse)[];

function isValidScore(value: unknown): value is ScoreValue {
  return value === 40 || value === 32 || value === 24;
}

interface Params {
  area: string;
  projectId: number;
}

export function useScoreArea({ area, projectId }: Params) {
  const criteria = useMemo(() => AREA_CRITERIA[area] ?? [], [area]);

  const majorQuery  = useGetMajorScore(area === "major"  ? projectId : 0);
  const reportQuery = useGetReportScore(area === "report" ? projectId : 0);
  const socialQuery = useGetSocialScore(area === "social" ? projectId : 0);

  const query =
    area === "major"  ? majorQuery  :
    area === "report" ? reportQuery :
    socialQuery;

  const existingScore  = query.data ?? null;
  const isQueryLoading = query.isLoading;

  const createMajor  = useCreateMajorScore();
  const updateMajor  = useUpdateMajorScore();
  const createReport = useCreateReportScore();
  const updateReport = useUpdateReportScore();
  const createSocial = useCreateSocialScore();
  const updateSocial = useUpdateSocialScore();

  const isMutating =
    createMajor.isPending  || updateMajor.isPending  ||
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

  const allScored = rows.every((r) => r.selectedScore !== null);

  // 해당 영역의 점수가 실제로 서버에 저장되어 있는지 확인
  // (다른 영역 점수만 있는 경우 existingScore가 non-null이어도 이 영역은 미채점 상태)
  const isAreaScored = existingScore !== null && criteria.every((c) => {
    const responseKey =
      Object.keys(existingScore).find((k) => (RESPONSE_TO_REQUEST_KEY[k] ?? k) === c.key) ?? c.key;
    const raw = (existingScore as unknown as Record<string, number>)[responseKey] ?? 0;
    return isValidScore(raw);
  });

  // 레코드(다른 영역 포함) 존재 여부. GET이 미채점 시에도 200 + 기본값을 반환하므로
  // existingScore !== null 만으로는 판단 불가 — 실제 채점 기준 필드 중 하나라도
  // 유효 점수(40/32/24)를 가지고 있는지로 "레코드 실존"을 판정한다.
  const recordExists =
    existingScore !== null &&
    SCORE_CRITERION_KEYS.some((k) => isValidScore(existingScore[k]));

  function selectScore(key: string, score: ScoreValue) {
    setLocalScores((prev) => ({ ...prev, [key]: prev[key] === score ? null : score }));
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
      userExperience:         get("userExperience"),
      socialValueCommunity:   get("socialValueCommunity"),
      aiUtilizationCommunity: get("aiUtilizationCommunity"),
      presentationCommunity:  get("presentationCommunity"),
    } satisfies CreateSocialScoreRequest;
  }

  function handleSave() {
    const body = buildBody();
    const onSuccess = () => { setLocalScores({}); setLocalComplete({}); };
    // 레코드가 하나이므로: 서버에 실제 채점 데이터가 있으면(다른 영역이라도) PATCH, 없으면 POST
    if (recordExists) {
      if (area === "major")        updateMajor.mutate(body as CreateMajorScoreRequest,   { onSuccess });
      else if (area === "report")  updateReport.mutate(body as CreateReportScoreRequest, { onSuccess });
      else                         updateSocial.mutate(body as CreateSocialScoreRequest, { onSuccess });
    } else {
      if (area === "major")        createMajor.mutate(body as CreateMajorScoreRequest,   { onSuccess });
      else if (area === "report")  createReport.mutate(body as CreateReportScoreRequest, { onSuccess });
      else                         createSocial.mutate(body as CreateSocialScoreRequest, { onSuccess });
    }
  }

  return {
    rows,
    allScored,
    isAreaScored,
    isQueryLoading,
    isMutating,
    existingScore,
    selectScore,
    toggleComplete,
    handleSave,
  };
}
