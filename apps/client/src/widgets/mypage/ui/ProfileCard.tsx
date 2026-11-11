"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { toast } from "sonner";

import {
  useDeleteProfileImage,
  useUpdateProfileImage,
  type MypageResponse,
} from "@/entities/mypage";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const TEAM_ROLES = ["LEADER", "MEMBER"];

interface ProfileCardProps {
  profile: MypageResponse;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const t = useTranslations("mypage.profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending: isUploading } =
    useUpdateProfileImage();
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteProfileImage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 나도록 비운다
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(t("invalidImageType"));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(t("imageTooLarge", { size: MAX_IMAGE_SIZE_MB }));
      return;
    }
    uploadImage(file);
  };

  const gradeClass =
    profile.grade && profile.classNo
      ? t("gradeClass", { grade: profile.grade, classNo: profile.classNo })
      : null;

  const roleLabel = (role: string) =>
    TEAM_ROLES.includes(role) ? t(`role.${role}`) : role;

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-5">
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full bg-gray-100">
          {profile.profileImageUrl ? (
            // 서버 업로드 이미지·GitHub 아바타 등 출처가 다양해 next/image 대신 img 를 쓴다
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profileImageUrl}
              alt={t("imageAlt", { name: profile.name })}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[28px] font-semibold text-gray-400">
              {profile.name.slice(0, 1)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-[22px] font-semibold tracking-[-0.5px] text-gray-900">
            {profile.name}
          </h2>
          <p className="text-[14px] text-gray-500">
            {[profile.studentNumber, gradeClass].filter(Boolean).join(" · ") ||
              profile.email}
          </p>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="cursor-pointer rounded-md bg-gray-100 px-3 py-1.5 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? t("uploading") : t("changeImage")}
            </button>
            {profile.customProfileImage && (
              <button
                type="button"
                onClick={() => deleteImage(undefined)}
                disabled={isDeleting}
                className="cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("deleteImage")}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-gray-400">{t("teams")}</span>
        {profile.teams.length === 0 ? (
          <p className="text-[14px] text-gray-500">{t("noTeams")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.teams.map((team) => (
              <li key={team.projectId}>
                <Link
                  href={`/projects/${team.projectId}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-gray-100 px-4 py-3 transition-colors hover:bg-gray-200"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[14px] font-medium text-gray-800">
                      {team.teamName}
                    </span>
                    <span className="truncate text-[12px] text-gray-500">
                      {team.projectName}
                    </span>
                  </div>
                  <span className="shrink-0 text-[12px] font-medium text-gray-600">
                    {[roleLabel(team.role), team.part]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
