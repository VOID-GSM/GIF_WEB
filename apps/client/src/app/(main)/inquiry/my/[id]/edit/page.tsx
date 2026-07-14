import MyInquiryEditView from "@/views/inquiry/ui/MyInquiryEditView";

export default async function MyInquiryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MyInquiryEditView inquiryId={Number(id)} />;
}
