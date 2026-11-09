import { FencePiece, PersonPiece, VehiclePiece } from "./RoadMakingPieces";

const RULES = [
  {
    icon: <VehiclePiece color="BLUE" direction="RIGHT" />,
    title: "차는 화살표 방향으로 직진해요",
    body: "다른 차는 그냥 지나가요.",
  },
  {
    icon: <FencePiece />,
    title: "울타리에 막히면 오른쪽으로 돌아요",
    body: "시계 방향으로 꺾은 뒤 다시 직진해요.",
  },
  {
    icon: <PersonPiece color="BLUE" />,
    title: "같은 색 사람에게 닿으면 도착",
    body: "다른 색 사람에게 닿거나 보드 밖으로 나가면 실패예요.",
  },
];

export default function RoadMakingRules({
  questionCount,
}: {
  questionCount: number;
}) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow">
      <h2 className="text-[16px] font-semibold tracking-[-0.4px] text-gray-900">
        규칙
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {RULES.map((rule) => (
          <li key={rule.title} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center">
              {rule.icon}
            </span>
            <div>
              <p className="text-[14px] font-semibold tracking-[-0.3px] text-gray-800">
                {rule.title}
              </p>
              <p className="mt-0.5 text-[13px] text-gray-600">{rule.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-[12px] bg-yellow-50 px-3 py-2.5 text-[13px] text-yellow-900">
        모든 차가 도착하도록 <b>정해진 개수만큼</b> 울타리를 놓고 제출하세요.
        제한 시간 5분 안에 <b>{questionCount}문제</b>를 풀어요. 문제마다 제출은
        한 번뿐이에요.
      </p>
    </section>
  );
}
