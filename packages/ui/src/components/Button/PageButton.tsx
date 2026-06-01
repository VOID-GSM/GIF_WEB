interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export default function PageButton({
  page,
  isActive,
  onClick,
}: PageButtonProps) {
  return (
    <button
      className={`w-8 h-8 rounded-full font-medium cursor-pointer
        ${isActive ? "bg-yellow-600" : "bg-gray-300"}`}
      onClick={onClick}
    >
      {page}
    </button>
  );
}
