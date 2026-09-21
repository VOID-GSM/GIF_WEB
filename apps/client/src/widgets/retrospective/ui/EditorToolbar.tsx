import type { ReactNode } from "react";

import {
  BoldIcon,
  CodeIcon,
  H1Icon,
  H2Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  QuoteIcon,
  UnderlineIcon,
} from "../lib/toolbarIcons";

export interface ToolbarItem {
  key: string;
  title: string;
  icon: ReactNode;
  /** 선택 영역을 감싸는 형태 (굵게·기울임 등) */
  wrap?: [string, string];
  /** 줄 앞에 붙는 형태 (제목·목록 등) */
  prefix?: string;
  /** 아직 지원하지 않는 기능 (이미지 업로드 등) */
  disabled?: boolean;
}

export const TOOLBAR_ITEMS: ToolbarItem[] = [
  { key: "bold", title: "굵게", icon: <BoldIcon />, wrap: ["**", "**"] },
  { key: "italic", title: "기울임", icon: <ItalicIcon />, wrap: ["_", "_"] },
  {
    key: "underline",
    title: "밑줄",
    icon: <UnderlineIcon />,
    wrap: ["<u>", "</u>"],
  },
  { key: "h1", title: "제목 1", icon: <H1Icon />, prefix: "# " },
  { key: "h2", title: "제목 2", icon: <H2Icon />, prefix: "## " },
  { key: "list", title: "목록", icon: <ListIcon />, prefix: "- " },
  { key: "quote", title: "인용", icon: <QuoteIcon />, prefix: "> " },
  {
    key: "code",
    title: "코드 블록",
    icon: <CodeIcon />,
    wrap: ["```\n", "\n```"],
  },
  { key: "link", title: "링크", icon: <LinkIcon />, wrap: ["[", "](https://)"] },
  {
    key: "image",
    title: "이미지 추가 (준비 중)",
    icon: <ImageIcon />,
    disabled: true,
  },
];

interface EditorToolbarProps {
  onItemClick: (item: ToolbarItem) => void;
}

export default function EditorToolbar({ onItemClick }: EditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="마크다운 서식"
      className="flex flex-wrap justify-evenly gap-2 rounded-[10px] border border-gray-200 bg-gray-100 p-1.5"
    >
      {TOOLBAR_ITEMS.map((item) => (
        <div key={item.key} className="group relative">
          <button
            type="button"
            aria-label={item.title}
            aria-disabled={item.disabled}
            onClick={() => onItemClick(item)}
            className={`flex h-7 w-8 cursor-pointer items-center justify-center rounded-[6px] text-gray-600 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-yellow-600 ${
              item.disabled
                ? "opacity-40 hover:bg-transparent"
                : "hover:scale-110 hover:bg-white hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
            }`}
          >
            {item.icon}
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-[6px] bg-gray-900 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-150 delay-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
