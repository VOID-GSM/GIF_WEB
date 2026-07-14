type SectionType = "major" | "report" | "social";
type SectionVariant = "active" | "inactive" | "unscored";

interface SectionBadgeProps {
  status: SectionType;
  variant: SectionVariant;
  label?: string;
  size?: "md" | "sm";
}

const variantStyles: Record<SectionVariant, { wrap: string; text: string }> = {
  active:   { wrap: "bg-green-50 border-success",    text: "text-green-dark dark:text-[var(--color-success)]" },
  unscored: { wrap: "bg-orange-50 border-orange-400", text: "text-orange-700" },
  inactive: { wrap: "bg-gray-100 border-gray-200",    text: "text-gray-400"  },
};

const sizeStyles: Record<"md" | "sm", { wrap: string; text: string }> = {
  md: { wrap: "py-[1px] px-[21px]", text: "text-[14px]" },
  sm: { wrap: "py-[2px] px-[10px]", text: "text-[12px]" },
};

const DEFAULT_LABELS: Record<SectionType, string> = {
  major: "전공 중심 영역",
  report: "보고서 영역",
  social: "사회 중심 영역",
};

export default function SectionBadge({ status, variant, label, size = "md" }: SectionBadgeProps) {
  const { wrap, text } = variantStyles[variant];
  const sizeCx = sizeStyles[size];
  return (
    <div className={`flex items-center w-fit border rounded-full ${sizeCx.wrap} ${wrap}`}>
      <span className={`font-semibold whitespace-nowrap ${sizeCx.text} ${text}`}>
        {label ?? DEFAULT_LABELS[status]}
      </span>
    </div>
  );
}
