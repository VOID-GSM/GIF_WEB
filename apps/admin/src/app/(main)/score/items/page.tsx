import ScoreItemGradeView from "@/views/score/ui/items/ScoreItemGradeView";

interface Props {
  searchParams: Promise<{ projectId?: string; teamName?: string }>;
}

export default async function ScoreItemGradePage({ searchParams }: Props) {
  const { projectId, teamName } = await searchParams;
  return (
    <ScoreItemGradeView
      key={projectId}
      projectId={Number(projectId ?? 0)}
      teamName={teamName ?? ""}
    />
  );
}
