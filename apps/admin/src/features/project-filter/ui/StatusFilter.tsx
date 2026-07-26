"use client";

interface StatusFilterProps<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

export default function StatusFilter<T extends string>({
  value,
  options,
  onChange,
}: StatusFilterProps<T>) {
  return (
    <div className="flex h-[40px] items-center gap-0.5 rounded-[32px] border border-gray-300 bg-white p-1">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`h-full cursor-pointer rounded-[28px] px-3 text-[14px] font-medium transition-colors ${
              selected
                ? "bg-yellow-300 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
