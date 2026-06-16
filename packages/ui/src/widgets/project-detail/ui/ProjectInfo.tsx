import NameBadge from "../../../components/Badge/NameBadge";

interface ProjectInfoMember {
  userId: number;
  name: string;
  studentNumber: string;
  role: string;
}

interface ProjectInfoProps {
  project: {
    name: string;
    teamName: string;
    description: string;
    logo: string;
    members: ProjectInfoMember[];
  };
}

// 읽기(잠금) 모드의 프로젝트 정보 영역 — 생성 페이지와 동일한 레이아웃 (admin·client 공용)
export default function ProjectInfo({ project }: ProjectInfoProps) {
  const readonlyValue = "text-2xl text-gray-900 font-medium";

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="mx-auto h-[160px] w-[240px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          {project.logo && (
            // logo는 외부 API에서 내려오는 동적 URL이라 next/image 대신 img 사용
            <img
              src={project.logo}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-2xl font-medium text-gray-700">
              프로젝트명
            </span>
            <span className={readonlyValue}>{project.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="shrink-0 text-2xl font-medium text-gray-700">
              팀명
            </span>
            <span className={readonlyValue}>{project.teamName}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-9 shrink-0 items-center">
              <span className="text-2xl font-medium text-gray-700">팀원</span>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {project.members.map((member) => (
                <NameBadge
                  key={member.userId}
                  id={Number(member.studentNumber)}
                  name={member.name}
                  isEditable={false}
                  color={member.role === "LEADER" ? "yellow" : "gray"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-2xl font-medium text-gray-700">프로젝트 설명</span>
        <p className="w-full break-words whitespace-pre-wrap font-medium leading-relaxed text-gray-700">
          {project.description}
        </p>
      </section>
    </div>
  );
}
