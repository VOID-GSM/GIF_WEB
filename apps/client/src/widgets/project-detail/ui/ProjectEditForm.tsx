"use client";

import { useState, type ChangeEvent } from "react";

import { FileUpload, SubmitButton, Textarea } from "@repo/ui";

import { useGetMe } from "@/entities/auth";
import {
  useUpdateProject,
  type ProjectDetail,
  type UserSearchResult,
} from "@/entities/project";
import { MemberSearchInput } from "@/features/member-search/ui/MemberSearchInput";

const MAX_NAME_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;

interface ProjectEditFormProps {
  project: ProjectDetail;
  onDone: () => void;
}

// 수정 모드 — 생성 페이지와 동일한 레이아웃에 기존 값 prefill, 완료 시 잠금으로 복귀
export default function ProjectEditForm({
  project,
  onDone,
}: ProjectEditFormProps) {
  const { data: me } = useGetMe();
  const { mutate, isPending } = useUpdateProject(project.id);

  // 본인(오너)을 제외한 팀원만 편집 대상 — 생성 페이지와 동일하게 학번/이름 표시
  const initialMembers: UserSearchResult[] = project.members
    .filter((member) => member.userId !== me?.userId)
    .map((member) => ({
      userId: member.userId,
      name: member.name,
      studentNumber: member.studentNumber,
    }));

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [projectName, setProjectName] = useState(project.name);
  const [teamName, setTeamName] = useState(project.teamName);
  const [members, setMembers] = useState<UserSearchResult[]>(initialMembers);
  const [description, setDescription] = useState(project.description);
  const [errors, setErrors] = useState({
    projectName: false,
    teamName: false,
    description: false,
  });

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH));
    if (e.target.value.trim())
      setErrors((prev) => ({ ...prev, description: false }));
  };

  const handleSubmit = () => {
    const newErrors = {
      projectName: !projectName.trim(),
      teamName: !teamName.trim(),
      description: !description.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    // 오너는 항상 제외하고 서버 원본(project.members) 기준으로 델타 계산.
    // me 로딩 타이밍과 무관하게 오너가 add/remove 에 섞이지 않도록 방어 → 409 방지
    const ownerId = me?.userId;
    const initialIds = project.members
      .map((member) => member.userId)
      .filter((id) => id !== ownerId);
    const currentIds = members
      .map((member) => member.userId)
      .filter((id) => id !== ownerId);

    mutate(
      {
        name: projectName,
        teamName,
        description,
        grade: project.grade,
        addMemberIds: currentIds.filter((id) => !initialIds.includes(id)),
        removeMemberIds: initialIds.filter((id) => !currentIds.includes(id)),
        logo: thumbnail ?? undefined,
      },
      { onSuccess: onDone },
    );
  };

  const underlineInput = (hasError: boolean) =>
    `w-full border-b bg-transparent pb-1 text-2xl outline-none transition-colors duration-200 ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-gray-900"
    }`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex w-full max-w-[830px] flex-col gap-14"
    >
      <section className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <FileUpload onChange={setThumbnail} className="mx-auto h-[160px] w-[240px]" />

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-4">
              <span className="shrink-0 text-2xl font-medium text-gray-700">
                프로젝트명
              </span>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  const val = e.target.value.slice(0, MAX_NAME_LENGTH);
                  setProjectName(val);
                  if (val) setErrors((prev) => ({ ...prev, projectName: false }));
                }}
                className={underlineInput(errors.projectName)}
              />
            </label>
            <div className="flex items-center justify-between">
              {errors.projectName ? (
                <span className="text-xs text-red-500">
                  프로젝트명을 입력해주세요
                </span>
              ) : (
                <span />
              )}
              <span
                className={`text-xs font-medium ${projectName.length >= MAX_NAME_LENGTH ? "text-red-500" : "text-gray-400"}`}
              >
                {projectName.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-4">
              <span className="shrink-0 text-2xl font-medium text-gray-700">
                팀명
              </span>
              <input
                type="text"
                value={teamName}
                onChange={(e) => {
                  const val = e.target.value.slice(0, MAX_NAME_LENGTH);
                  setTeamName(val);
                  if (val) setErrors((prev) => ({ ...prev, teamName: false }));
                }}
                className={underlineInput(errors.teamName)}
              />
            </label>
            <div className="flex items-center justify-between">
              {errors.teamName ? (
                <span className="text-xs text-red-500">팀명을 입력해주세요</span>
              ) : (
                <span />
              )}
              <span
                className={`text-xs font-medium ${teamName.length >= MAX_NAME_LENGTH ? "text-red-500" : "text-gray-400"}`}
              >
                {teamName.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </div>

          <MemberSearchInput
            owner={
              me
                ? {
                    userId: me.userId,
                    name: me.name,
                    studentNumber: me.studentNumber,
                  }
                : undefined
            }
            value={members}
            onChange={setMembers}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <span className="text-2xl font-medium text-gray-700">프로젝트 설명</span>
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          rows={8}
          maxLength={MAX_DESCRIPTION_LENGTH}
          title="500자 이내로 작성해주세요"
          className={errors.description ? "border-red-500" : ""}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <span className="text-xs text-red-500">
              프로젝트 설명을 입력해주세요
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs font-medium text-gray-700">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </section>

      <div className="flex justify-center">
        <SubmitButton disabled={isPending}>완료하기</SubmitButton>
      </div>
    </form>
  );
}
