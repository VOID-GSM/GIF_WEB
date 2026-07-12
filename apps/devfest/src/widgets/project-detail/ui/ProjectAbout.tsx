import SectionLabel from "@/shared/ui/SectionLabel";

interface ProjectAboutProps {
  description: string;
  tagline?: string; // 소개 라벨 위에 올리는 한 줄 소개 (없을 수 있음)
}

export default function ProjectAbout({
  description,
  tagline,
}: ProjectAboutProps) {
  const paragraphs = description.split(/\r?\n\r?\n/).filter(Boolean);
  const [lead, ...rest] = paragraphs;

  // tagline은 헤드라인 한 줄 + 뒤따르는 본문 문단으로 구성될 수 있음 (\n\n 구분)
  const taglineParts = tagline?.split(/\r?\n\r?\n/).filter(Boolean) ?? [];
  const [taglineHead, ...taglineBody] = taglineParts;

  return (
    <div>
      {taglineHead && (
        <div className="mb-10">
          <p className="text-[26px] font-bold leading-[1.3] tracking-[-0.5px] text-black">
            {taglineHead}
          </p>
          {taglineBody.map((paragraph, index) => (
            <p
              key={index}
              className="mt-4 text-[15px] leading-[1.8] text-gray-700"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {lead && (
        <>
          <SectionLabel>소개</SectionLabel>
          <div className="mt-6">
            <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.5px] text-black">
              {lead}
            </p>
            {rest.map((paragraph, index) => (
              <p
                key={index}
                className="mt-4 text-[15px] leading-[1.8] text-gray-700"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
