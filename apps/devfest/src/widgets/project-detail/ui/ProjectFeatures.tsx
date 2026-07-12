import SectionLabel from "@/shared/ui/SectionLabel";
import type { ProjectFeature } from "@/entities/project";

interface ProjectFeaturesProps {
  features: ProjectFeature[];
}

export default function ProjectFeatures({ features }: ProjectFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <div>
      <SectionLabel>기능</SectionLabel>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="group overflow-hidden rounded-[16px] bg-white shadow-new ring-1 ring-black/[0.04] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-2.5 bg-yellow-50 px-6 py-4">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-yellow-600 to-orange-400" />
              <h3 className="text-[17px] font-bold tracking-[-0.5px] text-black">
                {feature.title}
              </h3>
            </div>
            {feature.description && (
              <p className="px-6 py-5 text-[15px] leading-[1.75] text-gray-700">
                {feature.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
