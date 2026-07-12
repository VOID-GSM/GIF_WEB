import { useRef, useEffect } from "react";

interface TextFieldProps {
  fieldId: number;
  value: string;
  readOnly?: boolean;
  onChange: (fieldId: number, value: string) => void;
}

export default function TextField({
  fieldId,
  value,
  readOnly = false,
  onChange,
}: TextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // 높이 초기화
    el.style.height = `${el.scrollHeight}px`; // 내용 높이로 조절
  }, [value]);

  if (readOnly) {
    return (
      <div className="min-h-20 w-full break-words border border-gray-80 rounded-[10px] p-[15px] font-medium text-gray-800 whitespace-pre-wrap">
        {value || <span className="text-gray-400">답변 없음</span>}
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      className="min-h-20 w-full break-words border border-gray-80 rounded-[10px] p-[15px] font-medium outline-none resize-none placeholder:text-gray-500"
      placeholder="답변을 입력하세요"
      value={value}
      onChange={(e) => onChange(fieldId, e.target.value)}
    />
  );
}
