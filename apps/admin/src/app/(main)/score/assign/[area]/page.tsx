import ScoreAreaView from "@/views/score/ui/ScoreAreaView";

interface Props {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ projectId?: string; teamName?: string }>;
}

export default async function ScoreAreaPage({ params, searchParams }: Props) {
  const { area }                 = await params;
  const { projectId, teamName }  = await searchParams;
  return (
    <ScoreAreaView
      area={area}
      projectId={Number(projectId ?? 0)}
      teamName={decodeURIComponent(teamName ?? "")}
    />
  );
}
