"use client";

import { useState } from "react";
import {
  useGetScoreCriteria,
  useDeleteScoreCriteriaArea,
  useDeleteScoreCriteriaItem,
  useReorderScoreCriteria,
} from "@/entities/score";
import type { ScoreCriteriaArea, ScoreCriteriaItem } from "@/entities/score";
import { useGetMyInfo } from "@/entities/mypage";
import ScoreTabNav from "../ScoreTabNav";
import AreaFormModal from "./AreaFormModal";
import ItemFormModal from "./ItemFormModal";
import CriteriaAreaSection from "./CriteriaAreaSection";
import ScoreModal, { modalCancelCx, modalDangerCx } from "./ScoreModal";
import { getReorderChanges, type MoveDirection } from "./reorder";

type ModalState =
  | { type: "area"; area?: ScoreCriteriaArea }
  | { type: "item"; area: ScoreCriteriaArea; item?: ScoreCriteriaItem }
  | { type: "delete-area"; area: ScoreCriteriaArea }
  | { type: "delete-item"; area: ScoreCriteriaArea; item: ScoreCriteriaItem }
  | null;

export default function ScoreCriteriaView() {
  const { data: myInfo } = useGetMyInfo();
  // 조회는 선생님 전체, 생성·수정·삭제는 MASTER(아이디어페스티벌 담당)만 가능하다.
  const canEdit = myInfo?.adminRole === "MASTER";

  const { data: areas = [], isLoading, isError } = useGetScoreCriteria();
  const { mutate: deleteArea, isPending: isDeletingArea } = useDeleteScoreCriteriaArea();
  const { mutate: deleteItem, isPending: isDeletingItem } = useDeleteScoreCriteriaItem();
  const { mutate: reorder, isPending: isReordering } = useReorderScoreCriteria();
  const [modal, setModal] = useState<ModalState>(null);
  const closeModal = () => setModal(null);

  function moveArea(index: number, direction: MoveDirection) {
    const changes = getReorderChanges(areas, index, direction);
    if (changes.length === 0) return;
    reorder(changes.map((c) => ({ kind: "area", areaId: c.id, displayOrder: c.displayOrder })));
  }

  function moveItem(area: ScoreCriteriaArea, index: number, direction: MoveDirection) {
    const changes = getReorderChanges(area.items, index, direction);
    if (changes.length === 0) return;
    reorder(
      changes.map((c) => ({
        kind: "item",
        areaId: area.id,
        itemId: c.id,
        displayOrder: c.displayOrder,
      })),
    );
  }

  const totalMaxScore = areas.reduce((sum, area) => sum + area.totalMaxScore, 0);

  function renderBody() {
    if (isLoading) {
      return <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>;
    }
    if (isError) {
      return (
        <p className="py-10 text-center text-sm text-gray-400">평가 기준을 불러오지 못했습니다.</p>
      );
    }
    if (areas.length === 0) {
      return (
        <p className="py-10 text-center text-sm text-gray-400">
          {canEdit ? "평가 영역을 추가해주세요." : "아직 등록된 평가 기준이 없습니다."}
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        {areas.map((area, index) => (
          <CriteriaAreaSection
            key={area.id}
            area={area}
            canEdit={canEdit}
            isFirst={index === 0}
            isLast={index === areas.length - 1}
            isReordering={isReordering}
            onMoveArea={(direction) => moveArea(index, direction)}
            onMoveItem={(itemIndex, direction) => moveItem(area, itemIndex, direction)}
            onEditArea={() => setModal({ type: "area", area })}
            onDeleteArea={() => setModal({ type: "delete-area", area })}
            onAddItem={() => setModal({ type: "item", area })}
            onEditItem={(item) => setModal({ type: "item", area, item })}
            onDeleteItem={(item) => setModal({ type: "delete-item", area, item })}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-5">
        <ScoreTabNav />
        <div className="w-full flex flex-col gap-6 bg-white rounded-2xl border border-gray-200 shadow-new p-4 sm:p-7 md:p-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-gray-900">평가 기준</span>
              <span className="text-xs text-gray-500">
                영역 {areas.length}개 · 전체 최고점 {totalMaxScore}점
              </span>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => setModal({ type: "area" })}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 transition-colors cursor-pointer"
              >
                + 영역 추가
              </button>
            )}
          </div>
          {renderBody()}
        </div>
      </div>

      {modal?.type === "area" && <AreaFormModal area={modal.area} onClose={closeModal} />}

      {modal?.type === "item" && (
        <ItemFormModal
          areaId={modal.area.id}
          areaName={modal.area.name}
          item={modal.item}
          onClose={closeModal}
        />
      )}

      {modal?.type === "delete-area" && (
        <ScoreModal
          title={`'${modal.area.name}' 영역을 삭제하시겠습니까?`}
          description="하위 항목도 함께 삭제됩니다. 이미 매긴 점수 기록은 남습니다."
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className={modalCancelCx}>
                취소
              </button>
              <button
                type="button"
                disabled={isDeletingArea}
                onClick={() => deleteArea(modal.area.id, { onSuccess: closeModal })}
                className={modalDangerCx}
              >
                {isDeletingArea ? "삭제 중..." : "삭제"}
              </button>
            </>
          }
        />
      )}

      {modal?.type === "delete-item" && (
        <ScoreModal
          title={`'${modal.item.name}' 항목을 삭제하시겠습니까?`}
          description="이미 매긴 점수 기록은 남습니다."
          onClose={closeModal}
          footer={
            <>
              <button type="button" onClick={closeModal} className={modalCancelCx}>
                취소
              </button>
              <button
                type="button"
                disabled={isDeletingItem}
                onClick={() =>
                  deleteItem(
                    { areaId: modal.area.id, itemId: modal.item.id },
                    { onSuccess: closeModal },
                  )
                }
                className={modalDangerCx}
              >
                {isDeletingItem ? "삭제 중..." : "삭제"}
              </button>
            </>
          }
        />
      )}
    </div>
  );
}
