"use client";

import { useTranslations } from "next-intl";
import type { ClientRole } from "@/entities/signup";

interface ProjectListEmptyProps {
  role: ClientRole;
  onCreateProject?: () => void;
}

export default function ProjectListEmpty({
  role,
  onCreateProject,
}: ProjectListEmptyProps) {
  const t = useTranslations("project.list");
  if (role === "LEADER") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <p className="text-gray-500">{t("emptyLeader")}</p>
        <button
          type="button"
          onClick={onCreateProject}
          className="flex items-center rounded-4xl bg-yellow-600 px-8 py-[10px] text-[16px] font-semibold cursor-pointer"
        >
          {t("create")}
        </button>
      </div>
    );
  }

  return (
    <p className="py-20 text-center text-gray-500">
      {t.rich("emptyMember", { br: () => <br /> })}
    </p>
  );
}
