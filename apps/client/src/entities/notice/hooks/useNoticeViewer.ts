"use client";

import { useGetMyInfo } from "@/entities/mypage";
import { useGetMyProject } from "@/entities/project";

import type { NoticeViewer } from "../lib/noticeVisibility";

/**
 * 공지 대상 판정에 쓰는 내 학년·팀 정보를 모아 돌려준다.
 *
 * 학년은 학번 앞자리로 판단한다. 프로젝트가 없는 학생도 학년 대상 공지는 받아야 하기 때문에
 * 프로젝트의 grade 대신 학번을 쓴다.
 */
export function useNoticeViewer(): { viewer: NoticeViewer; isPending: boolean } {
  const { data: me, isPending: isMePending } = useGetMyInfo();
  const { data: myProjects, isPending: isMyProjectPending } = useGetMyProject();

  const firstDigit = me?.studentNumber?.[0];
  const grade =
    firstDigit && !Number.isNaN(Number(firstDigit)) ? Number(firstDigit) : null;

  return {
    viewer: { grade, teamName: myProjects?.[0]?.teamName ?? null },
    isPending: isMePending || isMyProjectPending,
  };
}
