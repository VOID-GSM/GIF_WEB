import SectionLabel from "@/shared/ui/SectionLabel";
import type { ProjectMember } from "@/entities/project";

interface ProjectTeamProps {
  members: ProjectMember[];
  leader?: string; // 팀장 이름
}

function MemberAvatar({ member }: { member: ProjectMember }) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.photo}
        alt={member.name}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-yellow-100"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 ring-2 ring-yellow-100">
      <span className="text-[20px] font-bold text-yellow-900">
        {member.name.slice(0, 1)}
      </span>
    </div>
  );
}

function MemberCard({
  member,
  showAvatar,
  isLeader,
}: {
  member: ProjectMember;
  showAvatar: boolean;
  isLeader: boolean;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-4">
        {showAvatar && <MemberAvatar member={member} />}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[17px] font-semibold text-black">
              {member.name}
            </p>
            {isLeader && (
              <span className="shrink-0 rounded-full bg-yellow-600 px-2 py-0.5 text-[11px] font-bold text-black">
                팀장
              </span>
            )}
          </div>
          {member.role && (
            <span className="mt-1 inline-block rounded-full bg-yellow-50 px-2.5 py-0.5 text-[12px] font-medium text-gray-700">
              {member.role}
            </span>
          )}
        </div>
      </div>
      <p className="text-[14px] leading-[1.75] text-gray-700">
        {member.description}
      </p>

      {member.skills && member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {(member.email || member.phone) && (
        <div className="flex flex-col gap-0.5 text-[12px] text-gray-500">
          {member.email && <span className="truncate">{member.email}</span>}
          {member.phone && <span>{member.phone}</span>}
        </div>
      )}
    </>
  );

  const base =
    "flex flex-col gap-4 rounded-[16px] bg-white p-5 shadow-new ring-1 ring-black/[0.04] h-full";

  // 포폴/깃허브 링크가 있으면 카드 전체를 클릭 시 이동
  if (member.portfolioUrl) {
    return (
      <a
        href={member.portfolioUrl}
        target="_blank"
        rel="noreferrer"
        className={`${base} relative cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-yellow-600/30`}
      >
        <span className="absolute right-4 top-4 text-[15px] text-gray-400">
          ↗
        </span>
        {inner}
      </a>
    );
  }

  return <div className={base}>{inner}</div>;
}

// 팀장 판별 — 역할에 "팀장"이 포함되거나 프로젝트의 leader 이름과 일치
function isLeaderMember(member: ProjectMember, leader?: string) {
  return member.role.includes("팀장") || member.name === leader;
}

export default function ProjectTeam({ members, leader }: ProjectTeamProps) {
  if (members.length === 0) return null;

  // 팀장을 항상 목록 맨 앞으로 이동(팀장/나머지 각각 원래 순서는 유지)
  const orderedMembers = [
    ...members.filter((member) => isLeaderMember(member, leader)),
    ...members.filter((member) => !isLeaderMember(member, leader)),
  ];

  // 팀 전체에 사진이 하나도 없으면 프로필 아바타(이니셜 대체)를 표시하지 않는다.
  const showAvatar = orderedMembers.some((member) => member.photo);

  return (
    <div>
      <SectionLabel>
        팀원{" "}
        <span className="text-[16px] font-medium text-gray-500">
          {members.length}명
        </span>
      </SectionLabel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedMembers.map((member) => (
          <MemberCard
            key={member.name}
            member={member}
            showAvatar={showAvatar}
            isLeader={isLeaderMember(member, leader)}
          />
        ))}
      </div>
    </div>
  );
}
