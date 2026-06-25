// 점수 영역 도메인 정의(ScoreArea/AREA_LABELS/ROLE_ALLOWED_AREAS)는 entities/score 로 이동.
// 기존 import 경로 호환을 위해 여기서 재export 한다.
export {
  AREA_LABELS,
  AREA_LABELS_SHORT,
  ROLE_ALLOWED_AREAS,
} from "@/entities/score";
export type { ScoreArea } from "@/entities/score";

export type ScoreFilter = "all" | "incomplete" | "complete";
export type ScoreValue = 40 | 32 | 24;

export interface CriterionRow {
  key: string;
  label: string;
  selectedScore: ScoreValue | null;
  isComplete: boolean;
}

export const SCORES: ScoreValue[] = [40, 32, 24];

export const AREA_CRITERIA: Record<string, { key: string; label: string }[]> = {
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
export const RESPONSE_TO_REQUEST_KEY: Record<string, string> = {
  aiUtilizationMajor: "aiUtilityMajorScore",
};
