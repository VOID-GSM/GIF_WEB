import ProfileSummaryCard from "./ProfileSummaryCard";
import DeadlineCountdownCard from "./DeadlineCountdownCard";
import ScheduleTimelineCard from "./ScheduleTimelineCard";

export default function RightSidebar() {
  return (
    <aside className="hidden w-[340px] shrink-0 flex-col gap-6 py-10 md:flex">
      <ProfileSummaryCard />
      <DeadlineCountdownCard />
      <ScheduleTimelineCard />
    </aside>
  );
}
