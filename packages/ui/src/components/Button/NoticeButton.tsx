interface NoticeButtonProps {
  onClick: () => void;
  label?: string;
}

export default function NoticeButton({ onClick, label = "공지하기" }: NoticeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-8 sm:px-12 py-2 sm:py-3 text-base sm:text-xl bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded-2xl transition-colors cursor-pointer shadow-sm"
    >
      {label}
    </button>
  );
}
