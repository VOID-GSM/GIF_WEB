interface NoticeButtonProps {
  onClick: () => void;
  label?: string;
}

export default function NoticeButton({ onClick, label = "공지하기" }: NoticeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-12 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-2xl transition-colors cursor-pointer shadow-sm"
    >
      {label}
    </button>
  );
}
