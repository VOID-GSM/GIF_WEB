import { useTranslations } from "next-intl";

type LabelType = "edit" | "complete";
type LabelVariant = "active" | "inactive";
interface LabelBadgeProps {
  status: LabelType;
  variant: LabelVariant;
}

export default function LabelBadge({ status, variant }: LabelBadgeProps) {
  const t = useTranslations("badge");
  return (
    <div
      className={`flex items-center w-fit px-[22px] py-1 rounded-full border
    ${variant === "active" ? "bg-yellow-50 border-yellow-600" : "bg-gray-100 border-gray-200"}`}
    >
      <span className="font-semibold text-[12px]">
        {status === "edit" ? t("edit") : t("complete")}
      </span>
    </div>
  );
}
