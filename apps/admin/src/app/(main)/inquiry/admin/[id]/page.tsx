import AdminInquiryDetailView from "@/views/inquiry/ui/AdminInquiryDetailView";

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminInquiryDetailView inquiryId={Number(id)} />;
}
