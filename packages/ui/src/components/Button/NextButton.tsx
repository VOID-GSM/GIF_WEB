interface NextButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export default function NextButton({ isActive, onClick }: NextButtonProps) {
  return (
    <button
      className={`flex w-full max-w-[320px] items-center justify-center py-[10px] rounded-[8px] font-semibold text-[20px] text-white
        ${isActive ? "bg-yellow-600 cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}
      onClick={onClick}
      disabled={!isActive}
    >
      다음
    </button>
  );
}
