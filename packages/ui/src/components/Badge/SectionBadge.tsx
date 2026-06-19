type SectionType = "major" | "report" | "social";
type SectionVariant = "active" | "inactive" | "unscored";

interface SectionBadgeProps {
  status: SectionType;
  variant: SectionVariant;
}

const variantStyles: Record<SectionVariant, { wrap: string; text: string }> = {
  active:   { wrap: "bg-green-50 border-success",    text: "text-green-dark" },
  unscored: { wrap: "bg-orange-50 border-orange-400", text: "text-orange-700" },
  inactive: { wrap: "bg-gray-100 border-gray-200",    text: "text-gray-400"  },
};

export default function SectionBadge({ status, variant }: SectionBadgeProps) {
  const { wrap, text } = variantStyles[variant];
  return (
    <div className={`flex items-center w-fit py-[1px] px-[21px] border rounded-full ${wrap}`}>
      <span className={`font-semibold text-[14px] ${text}`}>
        {status === "major"
          ? "전공 중심 영역"
          : status === "report"
            ? "보고서 영역"
            : "사회 중심 영역"}
      </span>
    </div>
  );
}
