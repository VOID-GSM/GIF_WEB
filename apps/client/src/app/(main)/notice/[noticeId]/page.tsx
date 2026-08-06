import NoticeDetailView from "@/views/notice/ui/NoticeDetailView";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ noticeId: string }>;
}) {
  const { noticeId } = await params;
  return <NoticeDetailView noticeId={Number(noticeId)} />;
}
