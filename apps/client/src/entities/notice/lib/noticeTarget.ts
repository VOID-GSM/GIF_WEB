/**
 * 공지 대상(targetGrades·targetTeamNames)을 배지에 표시할 라벨 목록으로 변환한다.
 * 학년·팀 지정이 모두 없으면 전체 공지로 간주한다.
 */
export function getNoticeTargetLabels(
  targetGrades: number[] = [],
  targetTeamNames: string[] = [],
  labels: { grade: (grade: number) => string; all: string },
): string[] {
  const gradeLabels = [...targetGrades]
    .sort((a, b) => a - b)
    .map(labels.grade);
  const result = [...gradeLabels, ...targetTeamNames];

  return result.length > 0 ? result : [labels.all];
}
