interface TextareaProps {
  title?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompositionStart?: (e: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onCompositionEnd?: (e: React.CompositionEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export default function Textarea({
  title = "내용을 입력하세요",
  value,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  rows,
  maxLength,
  className = "",
}: TextareaProps) {
  return (
    <textarea
      className="w-full py-[13px] px-[16px] border border-gray-200 rounded-[10px] font-medium placeholder:text-gray-500 outline-none resize-none
      transition-colors bg-white focus:border-yellow-600 [&:not(:placeholder-shown)]:border-yellow-600"
      placeholder={title}
      value={value}
      onChange={onChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      rows={rows}
      maxLength={maxLength}
    />
  );
}
