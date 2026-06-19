interface ScoreButtonProps {
  score: 40 | 32 | 24;
  variant: "active" | "inactive";
  onClick: () => void;
}

export default function ScoreButton({
  score,
  variant,
  onClick,
}: ScoreButtonProps) {
  return (
    <button
      className={`flex items-center w-fit py-[3px] px-4 rounded-full border cursor-pointer
      ${variant === "active" ? "bg-yellow-50 border-yellow-600" : "bg-gray-100 border-gray-200"}`}
      onClick={onClick}
    >
      <span className="font-medium text-[12px]">{score}</span>
    </button>
  );
}
