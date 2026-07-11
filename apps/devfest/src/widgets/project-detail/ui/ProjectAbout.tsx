import SectionLabel from "@/shared/ui/SectionLabel";

interface ProjectAboutProps {
  description: string;
}

export default function ProjectAbout({ description }: ProjectAboutProps) {
  const paragraphs = description.split("\n\n").filter(Boolean);
  const [lead, ...rest] = paragraphs;

  return (
    <div>
      <SectionLabel>소개</SectionLabel>
      <div className="mt-6">
        <p className="text-[20px] font-medium leading-[1.5] tracking-[-0.5px] text-black">
          {lead}
        </p>
        {rest.map((paragraph, index) => (
          <p key={index} className="mt-4 text-[15px] leading-[1.8] text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
