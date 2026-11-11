import { useTranslations } from "next-intl";

export type MemberRole = "leader" | "member";

interface MemberButtonProps {
  role: MemberRole;
  isActive: boolean;
  onClick: () => void;
}

export default function MemberButton({
  role,
  isActive,
  onClick,
}: MemberButtonProps) {
  const t = useTranslations("button");
  return (
    <button
      className={`w-[120px] h-[28px] rounded-[4px] text-[12px] border cursor-pointer
        ${
          isActive
            ? "bg-yellow-50 border-yellow-600 text-gray-900"
            : "bg-white border-gray-500 text-gray-500"
        }`}
      onClick={onClick}
    >
      {role === "leader" ? t("leader") : t("member")}
    </button>
  );
}
