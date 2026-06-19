interface Props {
  total: number;
  completed: number;
  pending: number;
}

const STAT_ITEMS = (total: number, completed: number, pending: number) => [
  { label: "전체 항목", value: total },
  { label: "평가 완료", value: completed },
  { label: "평가 대기", value: pending },
];

export default function ScoreAreaStats({ total, completed, pending }: Props) {
  return (
    <div className="flex gap-3 sm:gap-4 w-full max-w-[980px] mx-auto">
      {STAT_ITEMS(total, completed, pending).map(({ label, value }) => (
        <div
          key={label}
          className="flex-1 bg-white rounded-xl border border-gray-200 shadow-new px-4 sm:px-6 py-4"
        >
          <p className="text-xs sm:text-sm text-gray-500 mb-1">{label}</p>
          <p className="leading-none">
            <span className="text-xl sm:text-2xl font-bold text-orange-600">{value}</span>
            <span className="text-sm text-gray-400 ml-1">/ {total}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
