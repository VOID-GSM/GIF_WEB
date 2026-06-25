import FormSubmissionsView from "@/views/form-submissions/ui/FormSubmissionsView";

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  return <FormSubmissionsView formId={Number(formId)} />;
}
