"use client";

import { useState } from "react";
import { useCreateScoreCriteriaArea, useUpdateScoreCriteriaArea } from "@/entities/score";
import type { ScoreCriteriaArea } from "@/entities/score";
import ScoreModal, { fieldInputCx, modalCancelCx, modalPrimaryCx } from "./ScoreModal";

interface Props {
  /** 없으면 생성, 있으면 수정 */
  area?: ScoreCriteriaArea;
  onClose: () => void;
}

const MAX_NAME_LENGTH = 100;

export default function AreaFormModal({ area, onClose }: Props) {
  const isEdit = !!area;
  const [name, setName] = useState(area?.name ?? "");
  const { mutate: createArea, isPending: isCreating } = useCreateScoreCriteriaArea();
  const { mutate: updateArea, isPending: isUpdating } = useUpdateScoreCriteriaArea();
  const isPending = isCreating || isUpdating;

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && trimmed !== area?.name && !isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (isEdit) {
      updateArea({ areaId: area.id, name: trimmed }, { onSuccess: onClose });
    } else {
      createArea({ name: trimmed }, { onSuccess: onClose });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ScoreModal
        title={isEdit ? "평가 영역 수정" : "평가 영역 추가"}
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
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-gray-500">영역 이름</span>
          <input
            autoFocus
            value={name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 기술"
            className={fieldInputCx}
          />
        </label>
      </ScoreModal>
    </form>
  );
}
