import type { ListNoticeResponse } from "../model/type";

export interface NoticeViewer {
  /** 학번 앞자리에서 얻은 학년. 알 수 없으면 null */
  grade: number | null;
  /** 내가 속한 팀 이름. 팀이 없으면 null */
  teamName: string | null;
}

type NoticeTarget = Pick<
  ListNoticeResponse,
  "targetGrades" | "targetTeamNames"
>;

/**
 * 공지가 해당 사용자에게 보여야 하는지 판단한다.
 * - 학년·팀 지정이 모두 없으면 전체 공지이므로 항상 보인다 (getNoticeTargetLabels의 "전체"와 같은 기준).
 * - 그 외에는 내 학년이나 내 팀이 대상에 포함될 때만 보인다.
 *
 * GET /api/notice가 요청자와 무관하게 전체 목록을 내려주기 때문에 클라이언트에서 걸러야 한다.
 */
export function isNoticeVisible(
  notice: NoticeTarget,
  viewer: NoticeViewer,
): boolean {
  const targetGrades = notice.targetGrades ?? [];
  const targetTeamNames = notice.targetTeamNames ?? [];

  if (targetGrades.length === 0 && targetTeamNames.length === 0) return true;
  if (viewer.grade !== null && targetGrades.includes(viewer.grade)) return true;
  if (viewer.teamName !== null && targetTeamNames.includes(viewer.teamName)) {
    return true;
  }
  return false;
}
