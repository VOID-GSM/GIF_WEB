"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  AI_ASSIST_MAX_CONTENT_LENGTH,
  AI_ASSIST_MAX_TITLE_LENGTH,
  AI_ASSIST_MIN_CONTENT_LENGTH,
  isAiContentTooShort,
  useRetrospectiveAiAssist,
  type RetrospectiveAiAction,
  type RetrospectiveAiResult,
  type RetrospectiveCategory,
} from "@/entities/retrospective";

export interface AiAssistResult {
  action: RetrospectiveAiAction;
  data: RetrospectiveAiResult;
  /** 요청을 보낸 시점의 본문. 적용 전에 본문이 바뀌었는지 비교한다 */
  requestedContent: string;
}

interface UseAiAssistParams {
  title: string;
  category: RetrospectiveCategory;
  content: string;
  onApply: (content: string) => void;
}

function getErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return "AI 도움 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  if (error.code === "ECONNABORTED") {
    return "AI 응답이 너무 오래 걸려 요청을 중단했습니다. 잠시 후 다시 시도해 주세요.";
  }

  switch (error.response?.status) {
    case 400: {
      const message = (error.response.data as { message?: unknown } | undefined)?.message;
      return typeof message === "string" && message.trim()
        ? message
        : `본문은 ${AI_ASSIST_MAX_CONTENT_LENGTH.toLocaleString()}자 이하여야 하며, 다듬기와 포트폴리오 변환은 ${AI_ASSIST_MIN_CONTENT_LENGTH}자 이상 입력해 주세요.`;
    }
    case 429:
      return "오늘 사용할 수 있는 AI 도움 횟수(20회)를 모두 사용했습니다.";
    case 502:
      return "AI 응답에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    case 503:
      return "AI 기능이 현재 설정되어 있지 않습니다.";
    default:
      return "AI 도움 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

/**
 * AI 도움받기 요청·결과 상태.
 * 보기 모드에 따라 패널 위치가 바뀌어도 결과와 요청 콜백이 유지되도록
 * 패널이 아닌 작성 화면에서 한 번만 호출한다.
 */
export function useAiAssist({ title, category, content, onApply }: UseAiAssistParams) {
  const { mutate, isPending } = useRetrospectiveAiAssist();
  const [result, setResult] = useState<AiAssistResult | null>(null);
  const requestAssist = (action: RetrospectiveAiAction) => {
    // 버튼이 비활성화되기 전 연속 클릭으로 요청이 두 번 나가지 않게 막는다
    if (isPending) return;
    if (content.length > AI_ASSIST_MAX_CONTENT_LENGTH) {
      toast.error(`본문은 ${AI_ASSIST_MAX_CONTENT_LENGTH.toLocaleString()}자 이하로 입력해 주세요.`);
      return;
    }
    if (isAiContentTooShort(action, content)) {
      toast.error(`이 기능을 사용하려면 본문을 ${AI_ASSIST_MIN_CONTENT_LENGTH}자 이상 입력해 주세요.`);
      return;
    }

    mutate(
      {
        action,
        payload: {
          ...(title.trim() ? { title: title.trim().slice(0, AI_ASSIST_MAX_TITLE_LENGTH) } : {}),
          category,
          content,
        },
      },
      {
        onSuccess: (data) => {
          if (!data.content?.trim()) {
            toast.error("AI가 결과를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
            return;
          }
          setResult({ action, data, requestedContent: content });
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
    setResult(null);
  };

  // 요청 이후 본문을 고쳤다면, 적용 시 그 수정이 사라진다는 것을 미리보기에서 알린다
  const isContentChangedSinceRequest =
    result !== null && result.requestedContent !== content;

  const dismissResult = () => setResult(null);
  const applyResult = () => {
    if (!result) return;
    const previousContent = content;
    onApply(result.data.content);
    setResult(null);
    toast.success("AI 결과를 본문에 적용했습니다.", {
      action: { label: "되돌리기", onClick: () => onApply(previousContent) },
    });
  };

  return {
    isPending,
    result,
    isContentChangedSinceRequest,
    requestAssist,
    dismissResult,
    applyResult,
  };
}

export type AiAssistState = ReturnType<typeof useAiAssist>;
