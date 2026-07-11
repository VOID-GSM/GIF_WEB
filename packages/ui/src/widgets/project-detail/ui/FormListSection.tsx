import Chevron from "../../../svg/Chevron";

interface FormListSectionForm {
  id: number;
  title: string;
  deadline: string;
  announced: boolean;
  deadlineComplied: boolean;
}

interface FormListSectionProps {
  forms: FormListSectionForm[];
  // 양식 클릭 시 동작 (전달 시 각 행이 클릭 가능해짐)
  onFormClick?: (formId: number) => void;
}

// "2026-08-12T23:29:00" -> "2026.08.12 23:29" (날짜와 시간 분리, T 제거)
const formatDeadline = (deadline: string) => {
  if (!deadline) return "";
  const [datePart, timePart] = deadline.split("T");
  const date = datePart.replace(/-/g, ".");
  if (!timePart) return date;
  return `${date} ${timePart.slice(0, 5)}`;
};

// 마감일이 오늘(0시 기준)보다 이전이면 마감됨
const isOverdue = (deadline: string) => {
  const now = new Date();
  return new Date(deadline) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// 양식 제출 목록 (admin·client 공용)
// 부모가 flex 컨테이너(lg:items-stretch + min-h-0)를 제공하면 우측 컬럼 높이에 맞춰
// 끝점까지 채우고 넘치면 스크롤된다.
export default function FormListSection({
  forms,
  onFormClick,
}: FormListSectionProps) {
  const announced = forms.filter((form) => form.announced);

  return (
    <section className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
      <span className="text-xl font-semibold tracking-tight text-gray-600">
        양식 제출 목록
      </span>

      {announced.length === 0 ? (
        <div className="rounded-xl bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          아직 공지된 양식이 없습니다.
        </div>
      ) : (
        // lg: 목록을 absolute로 띄워 좌측 컬럼 높이 계산에서 제외 → 우측 컬럼이 높이를 결정
        <div className="relative lg:-mx-2 lg:min-h-0 lg:flex-1">
          {/* lg: 스크롤바 숨김 + 좌우/상하 여백으로 카드 그림자가 잘리지 않게 */}
          <ul className="flex flex-col gap-3 lg:absolute lg:inset-0 lg:overflow-y-auto lg:px-2 lg:py-1 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            {announced.map((form) => {
              const Row = onFormClick ? "button" : "div";
              return (
              <li key={form.id}>
                <Row
                  {...(onFormClick
                    ? {
                        type: "button" as const,
                        onClick: () => onFormClick(form.id),
                      }
                    : {})}
                  className={`flex w-full items-center justify-between rounded-xl bg-white px-6 py-2.5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
                    onFormClick
                      ? "cursor-pointer transition-shadow hover:shadow-md"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-base font-medium tracking-tight text-black">
                      {form.title}
                      {/* 상태 점 — 준수 초록 / 마감 지난 미준수 빨강 / 마감 전 미제출(대기) 그레이 */}
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          form.deadlineComplied
                            ? "bg-success"
                            : isOverdue(form.deadline)
                              ? "bg-orange-900"
                              : "bg-gray-400"
                        }`}
                        aria-label={
                          form.deadlineComplied
                            ? "준수"
                            : isOverdue(form.deadline)
                              ? "미준수"
                              : "대기"
                        }
                      />
                    </span>
                    <span className="text-xs font-medium tracking-tight text-gray-600">
                      {formatDeadline(form.deadline)}
                    </span>
                  </div>
                  <Chevron
                    direction="right"
                    className="size-4 shrink-0 text-gray-600"
                    aria-hidden="true"
                  />
                </Row>
              </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
