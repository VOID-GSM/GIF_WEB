"use client";

const GRADES = [1, 2] as const;

export type Grade = (typeof GRADES)[number];

interface GradeSelectorProps {
  grade: Grade;
  onGradeChange: (grade: Grade) => void;
}

const containerClass =
  "inline-flex gap-2 sm:gap-3 md:gap-5 rounded-full p-1 sm:p-1.5 md:p-2 shadow-new";

const buttonBaseClass =
  "rounded-full px-4 sm:px-6 md:px-8 py-1 sm:py-1.5 md:py-2 text-sm sm:text-base md:text-xl font-medium transition-colors";

const buttonActiveClass = "border border-yellow-400 bg-yellow-50";
const buttonInactiveClass = "border border-transparent";

export default function GradeSelector({ grade, onGradeChange }: GradeSelectorProps) {
  return (
    <div className={containerClass}>
      {GRADES.map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onGradeChange(g)}
          className={`${buttonBaseClass} ${grade === g ? buttonActiveClass : buttonInactiveClass}`}
        >
          {g}학년
        </button>
      ))}
    </div>
  );
}
