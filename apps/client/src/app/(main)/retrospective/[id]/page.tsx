import RetrospectiveDetailView from "@/views/retrospective/ui/RetrospectiveDetailView";

export default async function RetrospectiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RetrospectiveDetailView id={Number(id)} />;
}
