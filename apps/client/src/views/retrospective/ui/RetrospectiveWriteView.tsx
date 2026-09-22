"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { Chevron } from "@repo/ui";

import { useGetMe } from "@/entities/auth";
import {
  useGetRetrospectiveDetail,
  useSaveDraftRetrospective,
  useUpsertRetrospective,
  type DetailRetrospectiveResponse,
  type RelatedWork,
  type RetrospectiveCategory,
  type RetrospectiveVisibility,
} from "@/entities/retrospective";
import AiAssistPanel from "@/widgets/retrospective/ui/AiAssistPanel";
import DraftListModal from "@/widgets/retrospective/ui/DraftListModal";
import RelatedWorkList from "@/widgets/retrospective/ui/RelatedWorkList";
import RetrospectiveEditor, {
  type EditorMode,
} from "@/widgets/retrospective/ui/RetrospectiveEditor";
import RetrospectiveFormActions from "@/widgets/retrospective/ui/RetrospectiveFormActions";
import RetrospectiveMetaFields from "@/widgets/retrospective/ui/RetrospectiveMetaFields";

interface RetrospectiveWriteViewProps {
  retrospectiveId?: number;
}

export default function RetrospectiveWriteView({
  retrospectiveId,
}: RetrospectiveWriteViewProps) {
  const router = useRouter();

  const [draftId, setDraftId] = useState<number | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | undefined>(
    retrospectiveId,
  );
  const [category, setCategory] = useState<RetrospectiveCategory>("FEATURE");
  const [visibility, setVisibility] =
    useState<RetrospectiveVisibility>("PUBLIC");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [relatedWorks, setRelatedWorks] = useState<RelatedWork[]>([]);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("write");
  const isSplit = editorMode === "split";
  const { data: me } = useGetMe();
  const { data: retrospective } = useGetRetrospectiveDetail(retrospectiveId);

  const { mutate: submit, isPending: isSubmitting } = useUpsertRetrospective();
  const { mutate: saveDraft, isPending: isSavingDraft } =
    useSaveDraftRetrospective();

  useEffect(() => {
    if (!retrospective || retrospective.isDraft) return;

    startTransition(() => {
      setEditingId(retrospective.id);
      setCategory(retrospective.category);
      setVisibility(retrospective.visibility);
      setTitle(retrospective.title);
      setContent(retrospective.content);
      setTags(retrospective.tags ?? []);
      setRelatedWorks(retrospective.relatedWorks);
    });
  }, [retrospective]);

  const buildPayload = () => ({
    id: editingId ?? draftId,
    title: title.trim(),
    content,
    authorName: me?.name,
    category,
    visibility,
    tags,
    relatedWorks,
  });

  const handleSelectDraft = (draft: DetailRetrospectiveResponse) => {
    setDraftId(draft.id);
    setCategory(draft.category);
    setVisibility(draft.visibility);
    setTitle(draft.title);
    setContent(draft.content);
    setTags(draft.tags ?? []);
    setRelatedWorks(draft.relatedWorks);
    setIsDraftModalOpen(false);
    toast.success("임시 저장한 내용을 불러왔습니다.");
  };

  const handleSaveDraft = () => {
    if (!title.trim() && !content.trim()) {
      toast.error("제목이나 내용을 입력해주세요.");
      return;
    }

    saveDraft(buildPayload(), {
      onSuccess: (saved) => {
        setDraftId(saved);
        toast.success("임시 저장했습니다.");
      },
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    submit(buildPayload(), {
      onSuccess: () => {
        router.push("/retrospective");
      },
    });
  };

  return (
    <div className="flex min-h-dvh w-full justify-center bg-background px-4 py-8">
      <div className="w-full max-w-[960px]">
        {/* 상단 이동 */}
        <button
          type="button"
          onClick={() => router.push("/retrospective")}
          className="group -ml-1 flex cursor-pointer items-center gap-1 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          <Chevron
            direction="left"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          회고록
        </button>

        {/* 헤더 */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
            {editingId ? "회고록 수정" : "새 회고록 작성"}
          </h1>
          <button
            type="button"
            onClick={() => setIsDraftModalOpen(true)}
            className="shrink-0 cursor-pointer rounded-[10px] border border-gray-200 px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:border-yellow-600 hover:text-yellow-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            임시 저장 목록
          </button>
        </div>

        <div
          className={`mt-5 flex flex-col gap-5 ${isSplit ? "" : "lg:flex-row"}`}
        >
          {/* 본문 */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <RetrospectiveMetaFields
              category={category}
              onCategoryChange={setCategory}
              visibility={visibility}
              onVisibilityChange={setVisibility}
              title={title}
              onTitleChange={setTitle}
              tags={tags}
              onTagsChange={setTags}
            />

            <RetrospectiveEditor
              value={content}
              onChange={setContent}
              onModeChange={setEditorMode}
            />

            <RelatedWorkList
              relatedWorks={relatedWorks}
              onChange={setRelatedWorks}
            />

            {/* 같이 보기 모드에서는 사이드 패널이 아래로 내려와 전체 폭을 쓴다 */}
            {isSplit && <AiAssistPanel compact />}
          </div>

          {/* 사이드 패널 */}
          {!isSplit && (
            <div className="w-full shrink-0 lg:w-[260px]">
              <AiAssistPanel />
            </div>
          )}
        </div>

        <RetrospectiveFormActions
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEditing={Boolean(editingId)}
        />
      </div>

      {isDraftModalOpen && (
        <DraftListModal
          onClose={() => setIsDraftModalOpen(false)}
          onSelect={handleSelectDraft}
        />
      )}
    </div>
  );
}
