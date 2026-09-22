"use client";

import { FormEvent, useState } from "react";

import type {
  ProjectComment,
  ProjectEngagement as ProjectEngagementData,
} from "@/entities/project";

interface ProjectEngagementProps {
  engagement?: ProjectEngagementData;
}

export default function ProjectEngagement({
  engagement,
}: ProjectEngagementProps) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<ProjectComment[]>(
    engagement?.comments ?? [],
  );

  if (!engagement) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content) return;

    setComments((currentComments) => [
      ...currentComments,
      {
        id: Date.now(),
        author: "방문자",
        content,
        createdAt: "방금 전",
      },
    ]);
    setComment("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-400">
            Project reaction
          </p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            프로젝트에 반응을 남겨보세요
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
            조회수 {engagement.views.toLocaleString()}
          </span>
          <span className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
            댓글 {comments.length}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setLiked((currentLiked) => !currentLiked)}
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
          liked
            ? "bg-yellow-400 text-black"
            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-yellow-50"
        }`}
      >
        <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
        좋아요 {engagement.likes + (liked ? 1 : 0)}
      </button>

      <div className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="project-comment" className="sr-only">
            댓글 작성
          </label>
          <input
            id="project-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="프로젝트에 대한 응원을 남겨주세요"
            className="min-w-0 flex-1 rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-shadow placeholder:text-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
          />
          <button
            type="submit"
            className="rounded-[12px] bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            댓글 등록
          </button>
        </form>

        <div className="divide-y divide-gray-100 rounded-[16px] bg-white px-5 ring-1 ring-gray-100">
          {comments.map((item) => (
            <article key={item.id} className="py-5">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm text-gray-900">{item.author}</strong>
                <time className="text-xs text-gray-400">{item.createdAt}</time>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
