"use client";

import { useState } from "react";
import { useCreateScoreCriteriaItem, useUpdateScoreCriteriaItem } from "@/entities/score";
import type { ScoreCriteriaItem, PatchScoreCriteriaItemRequest } from "@/entities/score";
import ScoreModal, { fieldInputCx, modalCancelCx, modalPrimaryCx } from "./ScoreModal";
import { parseOptions } from "./parseOptions";
import OptionChip from "./OptionChip";

interface Props {
  areaId: number;
  areaName: string;
  /** 없으면 생성, 있으면 수정 */
  item?: ScoreCriteriaItem;
  onClose: () => void;
}

const MAX_NAME_LENGTH = 100;
const MAX_CRITERIA_LENGTH = 1000;

const sameOptions = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export default function ItemFormModal({ areaId, areaName, item, onClose }: Props) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [criteria, setCriteria] = useState(item?.criteria ?? "");
  const [optionsInput, setOptionsInput] = useState(item?.options.join(", ") ?? "");
  const { mutate: createItem, isPending: isCreating } = useCreateScoreCriteriaItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateScoreCriteriaItem();
  const isPending = isCreating || isUpdating;

  const trimmedName = name.trim();
  const trimmedCriteria = criteria.trim();
  const parsed = parseOptions(optionsInput);
  // 입력 전에는 에러를 띄우지 않는다.
  const optionsError = optionsInput.trim() && !parsed.ok ? parsed.error : null;

  // 수정 시에는 바뀐 값만 보낸다 (PATCH는 생략한 값을 유지).
  function buildPatch(): PatchScoreCriteriaItemRequest {
    if (!item || !parsed.ok) return {};
    const patch: PatchScoreCriteriaItemRequest = {};
    if (trimmedName !== item.name) patch.name = trimmedName;
    if (trimmedCriteria !== (item.criteria ?? "")) patch.criteria = trimmedCriteria;
    if (!sameOptions(parsed.options, item.options)) patch.options = parsed.options;
    return patch;
  }

  const hasChanges = !isEdit || Object.keys(buildPatch()).length > 0;
  const canSubmit = trimmedName.length > 0 && parsed.ok && hasChanges && !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !parsed.ok) return;
    if (isEdit) {
      updateItem({ areaId, itemId: item.id, ...buildPatch() }, { onSuccess: onClose });
    } else {
      createItem(
        {
          areaId,
          name: trimmedName,
          criteria: trimmedCriteria || undefined,
          options: parsed.options,
        },
        { onSuccess: onClose },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScoreModal
        title={isEdit ? "평가 항목 수정" : "평가 항목 추가"}
        description={
          isEdit
            ? `${areaName} 영역 · 선택지를 바꿔도 이미 매긴 점수는 바뀌지 않습니다.`
            : `${areaName} 영역`
        }
        onClose={onClose}
        footer={
          <>
            <button type="button" onClick={onClose} className={modalCancelCx}>
              취소
            </button>
            <button type="submit" disabled={!canSubmit} className={modalPrimaryCx}>
              {isPending ? "저장 중..." : isEdit ? "수정" : "추가"}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">항목 이름</span>
            <input
              autoFocus
              value={name}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) => setName(e.target.value)}
              placeholder="예) 기술적 완성도"
              className={fieldInputCx}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">평가 기준 (선택)</span>
            <textarea
              value={criteria}
              maxLength={MAX_CRITERIA_LENGTH}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="예) 핵심 기능이 정상적으로 동작하는가"
              rows={3}
              className={`${fieldInputCx} resize-none`}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">선택지 점수</span>
            <input
              value={optionsInput}
              onChange={(e) => setOptionsInput(e.target.value)}
              placeholder="쉼표로 구분 · 예) 40, 32, 24"
              inputMode="numeric"
              className={`${fieldInputCx} ${optionsError ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {optionsError ? (
              <span className="text-xs text-red-500">{optionsError}</span>
            ) : parsed.ok ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {parsed.options.map((score) => (
                  <OptionChip key={score} score={score} />
                ))}
                <span className="ml-1 text-xs text-gray-500">
                  최고점 <b className="text-gray-800">{parsed.options[0]}</b>점
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">
                1~10개, 0~1000점, 중복 불가. 최고점은 가장 큰 선택지로 자동 계산됩니다.
              </span>
            )}
          </label>
        </div>
      </ScoreModal>
    </form>
  );
}
