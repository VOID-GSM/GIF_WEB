"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { useUpdateMypage, type MypageResponse } from "@/entities/mypage";

const MAJOR_MAX_LENGTH = 50;
const TECH_STACK_MAX_COUNT = 20;
const TECH_STACK_MAX_LENGTH = 30;

interface ProfileDetailFormProps {
  profile: MypageResponse;
}

// 서버와 같이 대소문자만 다른 기술 스택은 하나만 남긴다
const hasStack = (stacks: string[], value: string) =>
  stacks.some((stack) => stack.toLowerCase() === value.toLowerCase());

export default function ProfileDetailForm({ profile }: ProfileDetailFormProps) {
  const t = useTranslations("mypage.detail");
  const [isEditing, setIsEditing] = useState(false);
  const [major, setMajor] = useState(profile.major ?? "");
  const [techStacks, setTechStacks] = useState<string[]>(profile.techStacks);
  const [stackInput, setStackInput] = useState("");
  const { mutate: updateMypage, isPending } = useUpdateMypage();

  const startEditing = () => {
    setMajor(profile.major ?? "");
    setTechStacks(profile.techStacks);
    setStackInput("");
    setIsEditing(true);
  };

  const addStack = () => {
    const value = stackInput.trim();
    if (!value) return;
    if (value.length > TECH_STACK_MAX_LENGTH) {
      toast.error(t("stackTooLong", { max: TECH_STACK_MAX_LENGTH }));
      return;
    }
    if (techStacks.length >= TECH_STACK_MAX_COUNT) {
      toast.error(t("stackLimit", { max: TECH_STACK_MAX_COUNT }));
      return;
    }
    if (!hasStack(techStacks, value)) setTechStacks([...techStacks, value]);
    setStackInput("");
  };

  const handleSave = () => {
    updateMypage(
      { major: major.trim(), techStacks },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-gray-900">{t("title")}</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="cursor-pointer text-[13px] font-medium text-gray-500 hover:text-gray-800"
          >
            {t("edit")}
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-gray-400">{t("major")}</span>
            <input
              value={major}
              onChange={(event) => setMajor(event.target.value)}
              maxLength={MAJOR_MAX_LENGTH}
              placeholder={t("majorPlaceholder")}
              className="h-10 rounded-lg border border-gray-200 px-3 text-[14px] outline-none focus:border-gray-400"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-gray-400">
              {t("techStackCount", {
                count: techStacks.length,
                max: TECH_STACK_MAX_COUNT,
              })}
            </span>
            <div className="flex gap-2">
              <input
                value={stackInput}
                onChange={(event) => setStackInput(event.target.value)}
                onKeyDown={(event) => {
                  // 한글 조합 중 Enter 는 무시해야 마지막 글자가 중복으로 들어가지 않는다
                  if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    addStack();
                  }
                }}
                maxLength={TECH_STACK_MAX_LENGTH}
                placeholder={t("stackPlaceholder")}
                className="h-10 min-w-0 flex-1 rounded-lg border border-gray-200 px-3 text-[14px] outline-none focus:border-gray-400"
              />
              <button
                type="button"
                onClick={addStack}
                className="h-10 shrink-0 cursor-pointer rounded-lg bg-gray-100 px-4 text-[13px] font-medium text-gray-700 hover:bg-gray-200"
              >
                {t("add")}
              </button>
            </div>
            <TechStackList
              stacks={techStacks}
              onRemove={(target) =>
                setTechStacks(techStacks.filter((stack) => stack !== target))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="h-10 cursor-pointer rounded-lg px-4 text-[13px] font-medium text-gray-500 hover:bg-gray-100"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="h-10 cursor-pointer rounded-lg bg-yellow-600 hover:bg-yellow-700 px-4 text-[13px] font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? t("saving") : t("save")}
            </button>
          </div>
        </>
      ) : (
        <dl className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <dt className="text-[13px] font-medium text-gray-400">{t("major")}</dt>
            <dd className="text-[14px] text-gray-800">{profile.major || "-"}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="text-[13px] font-medium text-gray-400">{t("techStacks")}</dt>
            <dd>
              {profile.techStacks.length === 0 ? (
                <span className="text-[14px] text-gray-800">-</span>
              ) : (
                <TechStackList stacks={profile.techStacks} />
              )}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}

function TechStackList({
  stacks,
  onRemove,
}: {
  stacks: string[];
  onRemove?: (stack: string) => void;
}) {
  const t = useTranslations("mypage.detail");
  if (stacks.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {stacks.map((stack) => (
        <li
          key={stack}
          className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-medium text-gray-700"
        >
          {stack}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(stack)}
              aria-label={t("removeStack", { stack })}
              className="cursor-pointer text-gray-400 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
