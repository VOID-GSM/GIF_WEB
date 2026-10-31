import RetrospectiveWriteView from "@/views/retrospective/ui/RetrospectiveWriteView";

export default async function RetrospectiveWritePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <RetrospectiveWriteView retrospectiveId={id ? Number(id) : undefined} />
  );
}
