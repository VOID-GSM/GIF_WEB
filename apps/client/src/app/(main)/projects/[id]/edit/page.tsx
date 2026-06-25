import ProjectEditView from "@/views/project-detail/ui/ProjectEditView";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectEditView projectId={Number(id)} />;
}
