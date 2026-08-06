export { useGetNotices, NOTICE_QUERY_KEY } from "./hooks/useGetNotices";
export { useGetNoticeDetail } from "./hooks/useGetNoticeDetail";
export { usePostNotice } from "./hooks/usePostNotice";
export { useDeleteNotice } from "./hooks/useDeleteNotice";
export { getNoticeTargetLabels } from "./lib/noticeTarget";
export type {
  PostNoticeRequest,
  ListNoticeResponse,
  DetailNoticeResponse,
} from "./model/type";
