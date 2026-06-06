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
  return (
    <button
      className={`w-[120px] h-[28px] rounded-[4px] text-[12px] border cursor-pointer
        ${
          isActive
            ? "bg-yellow-50 border-yellow-600 text-yellow-600"
            : "bg-white border-gray-500 text-gray-500"
        }`}
      onClick={onClick}
    >
      {role === "leader" ? "팀장" : "팀원"}
    </button>
  );
}
