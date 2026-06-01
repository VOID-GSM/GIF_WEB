import { Close } from "../..";

interface NameBadgeProps {
  id: number;
  name: string;
  isEditable: boolean;
  onRemove?: () => void;
}

export default function NameBadge({
  id,
  name,
  isEditable,
  onRemove,
}: NameBadgeProps) {
  return (
    <div
      className={`flex items-center w-fit px-4 py-1 rounded-full
      ${isEditable ? "bg-gray-200" : "bg-yellow-200"}`}
    >
      <span className="font-medium">
        {id} {name}
      </span>
      {isEditable && (
        <button
          className="text-gray-40 pl-[10px] cursor-pointer"
          onClick={onRemove}
        >
          <Close />
        </button>
      )}
    </div>
  );
}
