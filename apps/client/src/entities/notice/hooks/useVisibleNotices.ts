"use client";

import { useGetMyInfo } from "@/entities/mypage";
import { useGetMyProject } from "@/entities/project";

import { isNoticeVisible } from "../lib/noticeVisibility";
import { useGetNotices } from "./useGetNotices";

/**
 * 내 학년·팀이 대상인 공지만 남겨 돌려준다.
 * 서버가 대상과 무관하게 전체 공지를 내려주므로, 노출 지점(목록·배너)은 이 훅을 써야 한다.
 *
 * 학년은 학번 앞자리로 판단한다. 프로젝트가 없는 학생도 학년 대상 공지는 받아야 하기 때문에
 * 프로젝트의 grade 대신 학번을 쓴다.
 */
export function useVisibleNotices() {
  const { data: notices, isPending, isError } = useGetNotices();
  const { data: me, isPending: isMePending } = useGetMyInfo();
  const { data: myProjects, isPending: isMyProjectPending } = useGetMyProject();

  // 내 정보가 오기 전에 거르면 학년·팀 대상 공지가 잠깐 사라졌다 나타난다.
  const isViewerPending = isMePending || isMyProjectPending;

  const firstDigit = me?.studentNumber?.[0];
  const grade =
    firstDigit && !Number.isNaN(Number(firstDigit)) ? Number(firstDigit) : null;
  const teamName = myProjects?.[0]?.teamName ?? null;

  const visibleNotices = notices?.filter((notice) =>
    isNoticeVisible(notice, { grade, teamName }),
  );

  return {
    data: isViewerPending ? undefined : visibleNotices,
    isPending: isPending || isViewerPending,
    isError,
  };
}
