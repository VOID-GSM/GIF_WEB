type SectionType = "major" | "report" | "social";
type SectionVariant = "active" | "inactive";

interface SectionBadgeProps {
  status: SectionType;
  variant: SectionVariant;
}

export default function SectionBadge({ status, variant }: SectionBadgeProps) {
  return (
    <div
      className={`flex items-center w-fit py-[1px] px-[21px] border rounded-full
      ${variant === "active" ? "bg-green-50 border-success" : "bg-gray-100 border-gray-200"}`}
    >
      <span
        className={`font-semibold text-[14px]
          ${variant === "active" ? "text-green-dark" : "text-gray-500"}`}
      >
        {status === "major"
          ? "전공 중심 영역"
          : status === "report"
            ? "보고서 영역"
            : "사회 중심 영역"}
      </span>
    </div>
  );
}
