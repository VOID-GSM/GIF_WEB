import { QUESTION_COUNTS } from "@/entities/assessment";

interface QuestionCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
}

export default function QuestionCountSelector({
  value,
  onChange,
}: QuestionCountSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="문항 수"
      className="grid grid-cols-4 gap-1.5 sm:grid-cols-8"
    >
      {QUESTION_COUNTS.map((count) => {
        const active = count === value;
        return (
          <button
            key={count}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(count)}
            className={`h-10 rounded-[10px] border text-[15px] font-medium tracking-[-0.4px] transition-colors ${
              active
                ? "border-yellow-600 bg-yellow-100 font-semibold text-gray-900"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {count}개
          </button>
        );
      })}
    </div>
  );
}
