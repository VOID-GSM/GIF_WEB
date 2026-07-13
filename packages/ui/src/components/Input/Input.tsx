interface InputProps {
  title?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompositionStart?: (e: React.CompositionEvent<HTMLInputElement>) => void;
  onCompositionEnd?: (e: React.CompositionEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export default function Input({
  title = "양식의 제목을 입력하세요",
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  maxLength,
}: InputProps) {
  return (
    <input
      className="w-full py-[13px] px-[16px] border border-gray-200 rounded-[10px] font-medium placeholder:text-gray-500 outline-none
      transition-colors bg-white focus:border-yellow-600 [&:not(:placeholder-shown)]:border-yellow-600"
      placeholder={title}
      value={value}
      onChange={onChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      maxLength={maxLength}
    />
  );
}
