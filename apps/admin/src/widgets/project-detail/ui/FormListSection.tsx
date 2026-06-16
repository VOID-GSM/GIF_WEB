import type { FormSummary } from "@/entities/form";

interface FormListSectionProps {
  forms: FormSummary[];
}

// "2026-08-12" -> "2026.08.12"
const formatDeadline = (deadline: string) => deadline.replace(/-/g, ".");

// 양식 제출 목록 (디자인 698-5110 / 5095 / 5099)
// TODO: chevron 클릭 시 양식 상세(GET /api/form/{formId})로 이동 — 상세 페이지/라우트 확정 후 연동
export default function FormListSection({ forms }: FormListSectionProps) {
  const announced = forms.filter((form) => form.announced);

  return (
    <section className="flex flex-col gap-3">
      <span className="text-xl font-semibold tracking-tight text-gray-600">
        양식 제출 목록
      </span>

      {announced.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-new">
          아직 공지된 양식이 없습니다.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {announced.map((form) => (
            <li key={form.id}>
              <div className="flex items-center justify-between rounded-xl bg-white px-6 py-2.5 shadow-new">
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-base font-medium tracking-tight text-black">
                    {form.title}
                    {/* 준수 여부 — 준수 초록 / 미준수 빨강 */}
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        form.deadlineComplied ? "bg-success" : "bg-orange-900"
                      }`}
                      aria-label={form.deadlineComplied ? "준수" : "미준수"}
                    />
                  </span>
                  <span className="text-xs font-medium tracking-tight text-gray-600">
                    {formatDeadline(form.deadline)}
                  </span>
                </div>
                <svg
                  width="8"
                  height="16"
                  viewBox="0 0 8 16"
                  fill="none"
                  className="shrink-0 text-gray-600"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1L7 8L1 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
