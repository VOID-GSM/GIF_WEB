import { getNoticeTargetLabels } from "@/entities/notice";

interface NoticeTargetBadgesProps {
  targetGrades: number[];
  targetTeamNames: string[];
}

export default function NoticeTargetBadges({
  targetGrades,
  targetTeamNames,
}: NoticeTargetBadgesProps) {
  const labels = getNoticeTargetLabels(targetGrades, targetTeamNames);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {labels.map((label) => (
        <span
          key={label}
          className="shrink-0 rounded-full border border-yellow-600 bg-yellow-50 px-2 py-0.5 text-[11px] font-medium text-yellow-700"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
