"use client";

import { useTranslations } from "next-intl";

import { useGetMypage } from "@/entities/mypage";
import ActivityTabs from "@/widgets/mypage/ui/ActivityTabs";
import LinkManager from "@/widgets/mypage/ui/LinkManager";
import ProfileCard from "@/widgets/mypage/ui/ProfileCard";
import ProfileDetailForm from "@/widgets/mypage/ui/ProfileDetailForm";

export default function MypageView() {
  const t = useTranslations("mypage");
  const { data: profile, isLoading, isError } = useGetMypage();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-background px-6 py-8 pt-20 md:pt-8 lg:px-[93px]">
      <h1 className="mb-6 text-[26px] font-semibold leading-[1.2] tracking-[-0.6px] text-black">
        {t("title")}
      </h1>

      {isLoading ? (
        <p className="text-[14px] text-gray-500">{t("loading")}</p>
      ) : isError || !profile ? (
        <p className="text-[14px] text-red-500">{t("loadError")}</p>
      ) : (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-6 xl:w-[360px] xl:shrink-0">
            <ProfileCard profile={profile} />
            <ProfileDetailForm profile={profile} />
            <LinkManager links={profile.links} />
          </div>
          <div className="min-w-0 flex-1">
            <ActivityTabs />
          </div>
        </div>
      )}
    </div>
  );
}
