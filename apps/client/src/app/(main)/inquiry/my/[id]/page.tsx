import MyInquiryDetailView from "@/views/inquiry/ui/MyInquiryDetailView";

export default async function MyInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MyInquiryDetailView inquiryId={Number(id)} />;
}
