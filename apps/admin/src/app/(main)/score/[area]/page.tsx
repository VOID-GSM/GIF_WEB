import ScoreAreaView from "@/views/score/ui/ScoreAreaView";

interface Props {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ projectId?: string }>;
}

export default async function ScoreAreaPage({ params, searchParams }: Props) {
  const { area }       = await params;
  const { projectId }  = await searchParams;
  return (
    <ScoreAreaView
      key={`${area}-${projectId}`}
      area={area}
      projectId={Number(projectId ?? 0)}
    />
  );
}
