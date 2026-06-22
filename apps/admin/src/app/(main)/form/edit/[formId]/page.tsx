import FormEditView from "@/views/form-edit/ui/FormEditView";

export default async function FormEditPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  return <FormEditView formId={Number(formId)} />;
}
