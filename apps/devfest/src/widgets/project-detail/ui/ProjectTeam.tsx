import SectionLabel from "@/shared/ui/SectionLabel";
import type { ProjectMember } from "@/entities/project";

interface ProjectTeamProps {
  members: ProjectMember[];
}

function MemberAvatar({ member }: { member: ProjectMember }) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.photo}
        alt={member.name}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yellow-50">
      <span className="text-[20px] font-bold text-yellow-900">
        {member.name.slice(0, 1)}
      </span>
    </div>
  );
}

function MemberCard({ member }: { member: ProjectMember }) {
  const isLeader = member.role.includes("팀장");

  const inner = (
    <>
      <div className="flex items-center gap-4">
        <MemberAvatar member={member} />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold text-black">
            {member.name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
              isLeader ? "bg-yellow-600 text-black" : "bg-yellow-50 text-gray-700"
            }`}
          >
            {member.role}
          </span>
        </div>
      </div>
      <p className="text-[14px] leading-relaxed text-gray-600">
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
    "flex flex-col gap-4 rounded-[12px] bg-white p-5 shadow-new h-full";

  // 포폴/깃허브 링크가 있으면 카드 전체를 클릭 시 이동
  if (member.portfolioUrl) {
    return (
      <a
        href={member.portfolioUrl}
        target="_blank"
        rel="noreferrer"
        className={`${base} relative cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg`}
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

export default function ProjectTeam({ members }: ProjectTeamProps) {
  if (members.length === 0) return null;

  return (
    <div>
      <SectionLabel>
        팀원{" "}
        <span className="text-[16px] font-medium text-gray-500">
          {members.length}명
        </span>
      </SectionLabel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
