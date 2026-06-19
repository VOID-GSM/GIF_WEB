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
      className={`flex items-center w-fit h-9 rounded-full
      ${isEditable ? "bg-gray-200 px-4" : "bg-yellow-200 px-[26.5px]"}`}
    >
      <span className="font-medium">
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
