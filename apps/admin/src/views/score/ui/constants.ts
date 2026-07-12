// 점수 영역 도메인 정의(ScoreArea/AREA_LABELS/ROLE_ALLOWED_AREAS)는 entities/score 로 이동.
// 기존 import 경로 호환을 위해 여기서 재export 한다.
export {
  AREA_LABELS,
  AREA_LABELS_SHORT,
  ROLE_ALLOWED_AREAS,
  getAllowedAreas,
} from "@/entities/score";
export type { ScoreArea } from "@/entities/score";

export type ScoreFilter = "all" | "incomplete" | "complete";
export type ScoreValue = 40 | 32 | 24 | 25 | 20 | 15 | 10;

export interface CriterionRow {
  key: string;
  label: string;
  scores: ScoreValue[];
  selectedScore: ScoreValue | null;
  isComplete: boolean;
}

export interface CriterionDefinition {
  key: string;
  label: string;
  scores: ScoreValue[];
}

const HIGH_SCORES: ScoreValue[] = [40, 32, 24];
const MEDIUM_SCORES: ScoreValue[] = [25, 20, 15];
const LOW_SCORES: ScoreValue[] = [20, 15, 10];

export const AREA_CRITERIA: Record<string, CriterionDefinition[]> = {
  major: [
    { key: "technicalCompleteness", label: "기술적 완성도", scores: HIGH_SCORES },
    { key: "socialValueMajor",      label: "사회적 가치", scores: LOW_SCORES },
    { key: "aiUtilityMajorScore",   label: "AI 활용 능력", scores: LOW_SCORES },
    { key: "presentationMajor",     label: "프레젠테이션 및 설명", scores: LOW_SCORES },
  ],
  report: [
    { key: "reportWriting", label: "작성", scores: MEDIUM_SCORES },
    { key: "reportContent", label: "내용", scores: MEDIUM_SCORES },
    { key: "aiUsagePlan",   label: "AI 사용 계획", scores: MEDIUM_SCORES },
    { key: "creativity",    label: "창의성 및 독창", scores: MEDIUM_SCORES },
  ],
  social: [
    { key: "userExperience",         label: "사용자영역", scores: HIGH_SCORES },
    { key: "socialValueCommunity",   label: "사회적가치", scores: LOW_SCORES },
    { key: "aiUtilizationCommunity", label: "AI 활용 능력", scores: LOW_SCORES },
    { key: "presentationCommunity",  label: "프레젠테이션 및 설명", scores: LOW_SCORES },
  ],
};

// GET 응답 필드명 → 요청 필드명 매핑 (major 영역 AI 활용 필드명 불일치)
export const RESPONSE_TO_REQUEST_KEY: Record<string, string> = {
  aiUtilizationMajor: "aiUtilityMajorScore",
};
