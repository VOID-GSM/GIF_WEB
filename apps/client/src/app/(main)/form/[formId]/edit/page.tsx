import FormEditView from "@/views/form-edit/ui/FormEditView";

type PageProps = { params: Promise<{ formId: string }> };

export default async function Page({ params }: PageProps) {
  const { formId } = await params;

  return <FormEditView formId={Number(formId)} />;
}
