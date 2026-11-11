"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { toast } from "sonner";

import { Logout } from "@repo/ui";

import { useGetMe } from "@/entities/auth";
import { useUpdateClientInfo } from "@/entities/mypage";
import { useLogout } from "@/features/logout";

const NAME_MAX_LENGTH = 30;

// 외부 사용자(Google 로그인)용 최소 프로필 — 이름·이메일 확인, 이름 수정, 로그아웃.
// 외부 사용자는 PATCH /api/users/me 에서 이름만 바꿀 수 있다 (학번·역할을 보내면 403).
// 바꾼 이름은 다음 Google 로그인 때 덮어써지지 않는다.
export default function ExternalProfileCard() {
  const t = useTranslations("project.externalProfile");
  const handleLogout = useLogout();
  const { data, isLoading, isError } = useGetMe();
  const { mutate: updateMyInfo, isPending: isSaving } = useUpdateClientInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const startEditing = () => {
    setName(data?.name ?? "");
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(t("nameRequired"));
      return;
    }
    if (trimmed === data?.name) {
      setIsEditing(false);
      return;
    }
    updateMyInfo(
      { name: trimmed },
      {
        onSuccess: () => {
          toast.success(t("nameChanged"));
          setIsEditing(false);
        },
        onError: () => toast.error(t("nameChangeError")),
      },
    );
  };


  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-400">{t("myProfile")}</span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-medium text-gray-600">
          {t("visitor")}
        </span>
      </div>

      {isLoading ? (
        <p className="mt-4 text-[14px] text-gray-500">{t("loading")}</p>
      ) : isError ? (
        <p className="mt-4 text-[14px] text-red-500">
          {t("loadError")}
        </p>
      ) : (
        <>
          {isEditing ? (
            <form onSubmit={handleSave} className="mt-2 flex items-center gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX_LENGTH}
                aria-label={t("name")}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[15px] text-gray-900 outline-none focus:border-yellow-600"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="shrink-0 cursor-pointer rounded-lg bg-yellow-600 px-3 py-1.5 text-[13px] font-semibold text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="shrink-0 cursor-pointer text-[13px] font-medium text-gray-500"
              >
                {t("cancel")}
              </button>
            </form>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <h2 className="truncate text-[20px] font-semibold tracking-[-0.5px] text-gray-900">
                {data?.name ?? "-"}
              </h2>
              <button
                type="button"
                onClick={startEditing}
                className="shrink-0 cursor-pointer text-[12px] font-medium text-gray-400 transition-colors hover:text-gray-600"
              >
                {t("edit")}
              </button>
            </div>
          )}
          <p className="mt-1 truncate text-[14px] text-gray-500">
            {data?.email ?? "-"}
          </p>
        </>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-gray-500">
        {t("hint")}
      </p>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-5 flex h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gray-100 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700"
      >
        <Logout className="h-[13px] w-[16px]" aria-hidden="true" />
        {t("logout")}
      </button>
    </section>
  );
}
