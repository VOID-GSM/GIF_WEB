import Image from "next/image";

import type { AssessmentMeta } from "@/entities/assessment";

const TONE_STYLES = {
  yellow: {
    selected: "border-yellow-600 bg-yellow-50 ring-4 ring-yellow-200/60",
    badge: "bg-yellow-200 text-yellow-900",
    check: "bg-yellow-600",
  },
  orange: {
    selected: "border-orange-600 bg-orange-50 ring-4 ring-orange-100/70",
    badge: "bg-orange-100 text-orange-900",
    check: "bg-orange-600",
  },
} as const;

interface AssessmentTypeCardProps {
  assessment: AssessmentMeta;
  selected: boolean;
  onSelect: () => void;
}

export default function AssessmentTypeCard({
  assessment,
  selected,
  onSelect,
}: AssessmentTypeCardProps) {
  const tone = TONE_STYLES[assessment.tone];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group relative flex flex-col overflow-hidden rounded-[16px] border p-4 text-left transition-all duration-200 ${
        selected
          ? tone.selected
          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-[17px] font-semibold tracking-[-0.4px] text-gray-900">
          {assessment.title}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${tone.badge}`}
        >
          {assessment.ability}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-gray-600">
        {assessment.description}
      </p>

      <Image
        src={assessment.image}
        alt=""
        width={1536}
        height={1024}
        sizes="(min-width: 640px) 320px, 90vw"
        className={`mx-auto mt-2 h-[120px] w-auto object-contain transition-transform duration-300 ${
          selected ? "scale-[1.03]" : "group-hover:scale-[1.02]"
        }`}
      />

      {selected && (
        <span
          className={`absolute right-3 top-3 flex size-6 items-center justify-center rounded-full text-white ${tone.check}`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-3.5" aria-hidden>
            <path
              d="M5 10.5l3.2 3L15 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
