"use client";

import { GRADES, type Grade } from "@/entities/project";

interface GradeFilterProps {
  value: Grade;
  onChange: (grade: Grade) => void;
}

export default function GradeFilter({ value, onChange }: GradeFilterProps) {
  return (
    <div className="flex items-center gap-[20px] rounded-[32px] bg-white p-[8px] shadow-new">
      {GRADES.map((grade) => {
        const selected = grade === value;
        return (
          <button
            key={grade}
            type="button"
            onClick={() => onChange(grade)}
            className={`h-[40px] w-[120px] cursor-pointer rounded-[32px] border text-[20px] font-medium tracking-[-0.5px] text-black outline-none transition-colors focus:outline-none focus-visible:outline-none ${
              selected
                ? "border-yellow-400 bg-yellow-50"
                : "border-transparent bg-white"
            }`}
          >
            {grade}학년
          </button>
        );
      })}
    </div>
  );
}
