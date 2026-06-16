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

function normalizeKey(key: string): string {
  return RESPONSE_TO_REQUEST_KEY[key] ?? key;
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

  const completed = rows.filter((r) =>  r.isComplete).length;
  const pending   = rows.filter((r) => !r.isComplete).length;
  const allScored = rows.every((r) => r.selectedScore !== null);

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
    if (existingScore) {
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
    completed,
    pending,
    allScored,
    isQueryLoading,
    isMutating,
    existingScore,
    selectScore,
    toggleComplete,
    handleSave,
  };
}
