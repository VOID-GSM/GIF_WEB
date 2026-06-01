type StatuseState = "deadline" | "edit" | "write";
interface StatusBadgeProps {
  status: StatuseState;
}

const STATUS_MAP = {
  deadline: { label: "마감", className: "bg-gray-100 border-gray-200" },
  edit: { label: "수정", className: "bg-orange-50 border-orange-400" },
  write: { label: "작성", className: "bg-yellow-50 border-yellow-600" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_MAP[status];
  return (
    <div
      className={`flex items-center w-fit px-[26px] py-[5px] rounded-[12px] border ${className}`}
    >
      <span className="font-medium">{label}</span>
    </div>
  );
}
