"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  useAddMyLink,
  useDeleteMyLink,
  useUpdateMyLink,
  type UserLink,
} from "@/entities/mypage";

const MAX_LINK_COUNT = 5;
const TITLE_MAX_LENGTH = 30;
const URL_MAX_LENGTH = 500;

const inputClassName =
  "h-11 rounded-lg border border-gray-200 bg-white px-3.5 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-yellow-600";

// 서버와 같이 http/https 주소만 허용한다 (javascript: 등 차단)
const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

interface LinkManagerProps {
  links: UserLink[];
}

// null: 폼 닫힘, "new": 추가, number: 해당 링크 수정
type EditingTarget = null | "new" | number;

export default function LinkManager({ links }: LinkManagerProps) {
  const [editing, setEditing] = useState<EditingTarget>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const { mutate: addLink, isPending: isAdding } = useAddMyLink();
  const { mutate: updateLink, isPending: isUpdating } = useUpdateMyLink();
  const { mutate: deleteLink } = useDeleteMyLink();

  const openForm = (target: EditingTarget, link?: UserLink) => {
    setEditing(target);
    setTitle(link?.title ?? "");
    setUrl(link?.url ?? "");
  };

  const closeForm = () => setEditing(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedUrl = url.trim();
    if (!isHttpUrl(trimmedUrl)) {
      toast.error("http:// 또는 https:// 로 시작하는 주소를 입력해 주세요.");
      return;
    }
    const body = { title: title.trim() || undefined, url: trimmedUrl };

    if (editing === "new") {
      addLink(body, { onSuccess: closeForm });
    } else if (typeof editing === "number") {
      updateLink({ linkId: editing, ...body }, { onSuccess: closeForm });
    }
  };

  const form = (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-gray-600">
          이름 <span className="text-gray-400">(선택)</span>
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="예: 블로그, 포트폴리오"
          className={inputClassName}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] font-medium text-gray-600">주소</span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          maxLength={URL_MAX_LENGTH}
          placeholder="https://"
          required
          className={inputClassName}
        />
      </label>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeForm}
          className="h-9 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 text-[13px] font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isAdding || isUpdating}
          className="h-9 cursor-pointer rounded-lg bg-yellow-600 px-4 text-[13px] font-medium text-gray-900 transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  );

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-gray-900">
          개인 링크{" "}
          <span className="text-[13px] font-medium text-gray-400">
            {links.length}/{MAX_LINK_COUNT}
          </span>
        </h3>
        {links.length < MAX_LINK_COUNT && editing === null && (
          <button
            type="button"
            onClick={() => openForm("new")}
            className="cursor-pointer text-[13px] font-medium text-gray-500 hover:text-gray-800"
          >
            + 추가
          </button>
        )}
      </div>

      {links.length === 0 && editing === null && (
        <p className="text-[14px] text-gray-500">
          포트폴리오, 블로그 같은 개인 사이트를 추가해 보세요.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {links.map((link) =>
          editing === link.id ? (
            <li key={link.id}>{form}</li>
          ) : (
            <li
              key={link.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-col hover:underline"
              >
                <span className="truncate text-[14px] font-medium text-gray-800">
                  {link.title || link.url}
                </span>
                {link.title && (
                  <span className="truncate text-[12px] text-gray-400">{link.url}</span>
                )}
              </a>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openForm(link.id, link)}
                  className="cursor-pointer text-[12px] font-medium text-gray-500 hover:text-gray-800"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => deleteLink(link.id)}
                  className="cursor-pointer text-[12px] font-medium text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {editing === "new" && form}
    </section>
  );
}
