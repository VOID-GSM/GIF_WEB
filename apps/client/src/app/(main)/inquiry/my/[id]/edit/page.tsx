import MyInquiryEditView from "@/views/inquiry/ui/MyInquiryEditView";

export default async function MyInquiryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  return <MyInquiryEditView key={inquiryId} inquiryId={inquiryId} />;
}
