import ProjectDetailView from "@/views/project-detail/ui/ProjectDetailView";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailView projectId={Number(id)} />;
}
