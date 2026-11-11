import { useTranslations } from "next-intl";

type StatusState = "deadline" | "edit" | "write";
interface StatusBadgeProps {
  status: StatusState;
}

const STATUS_MAP = {
  deadline: { labelKey: "deadline", className: "bg-gray-100 border-gray-200" },
  edit: { labelKey: "edit", className: "bg-orange-50 border-orange-400" },
  write: { labelKey: "write", className: "bg-yellow-50 border-yellow-600" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("badge");
  const { labelKey, className } = STATUS_MAP[status];
  return (
    <div
      className={`flex items-center w-fit px-[26px] py-[5px] rounded-[12px] border ${className}`}
    >
      <span className="font-medium">{t(labelKey)}</span>
    </div>
  );
}
