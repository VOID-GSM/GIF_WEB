interface InputProps {
  title?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  title = "양식의 제목을 입력하세요",
  value,
  onChange,
}: InputProps) {
  return (
    <input
      className="w-full py-[13px] px-[16px] border border-gray-200 rounded-[10px] font-medium placeholder:text-gray-500 outline-none"
      placeholder={title}
      value={value}
      onChange={onChange}
    />
  );
}
