"use client";

import { isNoticeVisible } from "../lib/noticeVisibility";
import { useGetNotices } from "./useGetNotices";
import { useNoticeViewer } from "./useNoticeViewer";

/**
 * 내 학년·팀이 대상인 공지만 남겨 돌려준다.
 * 서버가 대상과 무관하게 전체 공지를 내려주므로, 노출 지점(목록·배너)은 이 훅을 써야 한다.
 */
export function useVisibleNotices() {
  const { data: notices, isPending, isError } = useGetNotices();
  const { viewer, isPending: isViewerPending } = useNoticeViewer();

  // 내 정보가 오기 전에 거르면 학년·팀 대상 공지가 잠깐 사라졌다 나타난다.
  const visibleNotices = notices?.filter((notice) =>
    isNoticeVisible(notice, viewer),
  );

  return {
    data: isViewerPending ? undefined : visibleNotices,
    isPending: isPending || isViewerPending,
    isError,
  };
}
