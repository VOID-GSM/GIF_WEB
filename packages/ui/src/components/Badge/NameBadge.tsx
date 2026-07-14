import { Close } from "../..";

interface NameBadgeProps {
  id: number;
  name: string;
  isEditable: boolean;
  onRemove?: () => void;
  // 색상을 명시하지 않으면 기존 동작 유지 (editable=회색, 아니면 노란색)
  color?: "yellow" | "gray";
}

export default function NameBadge({
  id,
  name,
  isEditable,
  onRemove,
  color,
}: NameBadgeProps) {
  const resolvedColor = color ?? (isEditable ? "gray" : "yellow");

  return (
    <div
      className={`flex items-center w-fit h-9 rounded-full
      ${resolvedColor === "gray" ? "bg-gray-200" : "bg-[#fff695] dark:bg-yellow-600/35"}
      ${isEditable ? "px-4" : "px-[26.5px]"}`}
    >
      <span className="font-medium text-gray-900">
        {id} {name}
      </span>
      {isEditable && (
        <button
          type="button"
          className="text-gray-400 pl-[10px] cursor-pointer"
          onClick={onRemove}
        >
          <Close />
        </button>
      )}
    </div>
  );
}
