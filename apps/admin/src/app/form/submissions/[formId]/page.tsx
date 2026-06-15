import FormDetailView from "@/views/form-detail/ui/FormDetailView";

export default async function FormCreate({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  return <FormDetailView formId={Number(formId)} />; // teamId 제거
}
