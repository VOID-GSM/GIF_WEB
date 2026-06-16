import FormSubmitView from "@/views/form-submit/ui/FormSubmitView";

type PageProps = { params: Promise<{ formId: string }> };

export default async function Page({ params }: PageProps) {
  const { formId } = await params;

  return <FormSubmitView formId={Number(formId)} projectId={1} />;
}
