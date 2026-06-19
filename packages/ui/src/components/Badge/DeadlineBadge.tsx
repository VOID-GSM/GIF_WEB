type DeadlineStatus = "before" | "after";
interface DeadlineBadgeProps {
  status: DeadlineStatus;
}

export default function DeadlineBadge({ status }: DeadlineBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center w-[64px] py-1 rounded-full
      ${status === "before" ? "bg-success" : "bg-gray-300"}`}
    >
      <span className="text-[12px] font-semibold">
        {status === "before" ? "마감 전" : "마감"}
      </span>
    </div>
  );
}
