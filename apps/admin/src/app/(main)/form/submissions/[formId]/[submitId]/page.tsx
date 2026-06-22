import FormDetailView from "@/views/form-detail/ui/FormDetailView";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string; submitId: string }>;
}) {
  const { formId, submitId } = await params;

  return (
    <FormDetailView
      formId={Number(formId)}
      submitId={Number(submitId)}
    />
  );
}
