export type GrantStatus = "granted" | "ungranted";

interface GrantButtonProps {
  status: GrantStatus;
  isActive: boolean;
  onClick: () => void;
}

export default function GrantButton({
  status,
  isActive,
  onClick,
}: GrantButtonProps) {
  return (
    <button
      className={`flex items-center w-fit py-[6.5px] px-[10px] rounded-[8px] text-[12px] border cursor-pointer
        ${
          isActive
            ? "bg-white border-yellow-600 text-yellow-600"
            : "bg-white border-gray-500 text-gray-500"
        }`}
      onClick={onClick}
    >
      {status === "granted" ? "점수 부여 완료" : "점수 미부여"}
    </button>
  );
}
