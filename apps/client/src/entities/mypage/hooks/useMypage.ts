"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import {
  addMyLink,
  deleteMyLink,
  deleteProfileImage,
  getMypage,
  updateMyLink,
  updateMypage,
  updateProfileImage,
} from "../api";
import type { MypageResponse } from "../model/type";

export const MYPAGE_QUERY_KEY = ["mypage"] as const;

const getErrorMessage = (error: unknown, fallback: string) =>
  (isAxiosError<{ message?: string }>(error) &&
    error.response?.data?.message) ||
  fallback;

export function useGetMypage() {
  return useQuery({
    queryKey: MYPAGE_QUERY_KEY,
    queryFn: getMypage,
  });
}

// 응답으로 최신 마이페이지 정보를 내려주는 요청은 캐시를 바로 갈아끼운다.
function useMypageMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<MypageResponse>,
  messages: { success: string; error: string },
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.setQueryData(MYPAGE_QUERY_KEY, data);
      toast.success(messages.success);
    },
    onError: (error) => toast.error(getErrorMessage(error, messages.error)),
  });
}

export function useUpdateMypage() {
  return useMypageMutation(updateMypage, {
    success: "프로필을 저장했어요.",
    error: "프로필을 저장하지 못했어요.",
  });
}

export function useUpdateProfileImage() {
  return useMypageMutation(updateProfileImage, {
    success: "프로필 이미지를 바꿨어요.",
    error: "프로필 이미지를 올리지 못했어요.",
  });
}

export function useDeleteProfileImage() {
  return useMypageMutation(() => deleteProfileImage(), {
    success: "프로필 이미지를 삭제했어요.",
    error: "프로필 이미지를 삭제하지 못했어요.",
  });
}

// 링크 API는 링크만 돌려주므로 마이페이지 정보를 다시 불러온다.
function useLinkMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  messages: { success: string; error: string },
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MYPAGE_QUERY_KEY });
      toast.success(messages.success);
    },
    onError: (error) => toast.error(getErrorMessage(error, messages.error)),
  });
}

export function useAddMyLink() {
  return useLinkMutation(addMyLink, {
    success: "링크를 추가했어요.",
    error: "링크를 추가하지 못했어요.",
  });
}

export function useUpdateMyLink() {
  return useLinkMutation(updateMyLink, {
    success: "링크를 수정했어요.",
    error: "링크를 수정하지 못했어요.",
  });
}

export function useDeleteMyLink() {
  return useLinkMutation(deleteMyLink, {
    success: "링크를 삭제했어요.",
    error: "링크를 삭제하지 못했어요.",
  });
}
