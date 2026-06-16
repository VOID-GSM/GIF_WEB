import type { DeadlineSummary } from "@/entities/form";

interface DeadlineStatusSectionProps {
  summary: DeadlineSummary;
}

interface StatCardProps {
  label: string;
  value: number;
  valueClassName: string;
}

// 디자인 698-5092 / 5103 / 5106 — 흰 카드, 라벨 좌측 / 숫자 우측
function StatCard({ label, value, valueClassName }: StatCardProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-new">
      <span className="text-xl font-medium tracking-tight text-gray-800">
        {label}
      </span>
      <span className={`text-xl font-semibold tracking-tight ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

// 마감 현황 — 전체 / 준수 / 미준수 (디자인 698-5109)
export default function DeadlineStatusSection({
  summary,
}: DeadlineStatusSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <span className="text-xl font-semibold tracking-tight text-gray-600">
        마감 현황
      </span>
      <div className="flex gap-3">
        <StatCard
          label="전체"
          value={summary.total}
          valueClassName="text-yellow-700"
        />
        <StatCard
          label="준수"
          value={summary.met}
          valueClassName="text-success"
        />
        <StatCard
          label="미준수"
          value={summary.notMet}
          valueClassName="text-orange-900"
        />
      </div>
    </section>
  );
}
