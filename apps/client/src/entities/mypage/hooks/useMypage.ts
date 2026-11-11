"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
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

type ToastKey =
  | "profileSaved"
  | "profileSaveError"
  | "imageChanged"
  | "imageUploadError"
  | "imageDeleted"
  | "imageDeleteError"
  | "linkAdded"
  | "linkAddError"
  | "linkUpdated"
  | "linkUpdateError"
  | "linkDeleted"
  | "linkDeleteError";

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
  messages: { success: ToastKey; error: ToastKey },
) {
  const t = useTranslations("mypage.toast");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      queryClient.setQueryData(MYPAGE_QUERY_KEY, data);
      toast.success(t(messages.success));
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, t(messages.error))),
  });
}

export function useUpdateMypage() {
  return useMypageMutation(updateMypage, {
    success: "profileSaved",
    error: "profileSaveError",
  });
}

export function useUpdateProfileImage() {
  return useMypageMutation(updateProfileImage, {
    success: "imageChanged",
    error: "imageUploadError",
  });
}

export function useDeleteProfileImage() {
  return useMypageMutation(() => deleteProfileImage(), {
    success: "imageDeleted",
    error: "imageDeleteError",
  });
}

// 링크 API는 링크만 돌려주므로 마이페이지 정보를 다시 불러온다.
function useLinkMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  messages: { success: ToastKey; error: ToastKey },
) {
  const t = useTranslations("mypage.toast");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MYPAGE_QUERY_KEY });
      toast.success(t(messages.success));
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, t(messages.error))),
  });
}

export function useAddMyLink() {
  return useLinkMutation(addMyLink, {
    success: "linkAdded",
    error: "linkAddError",
  });
}

export function useUpdateMyLink() {
  return useLinkMutation(updateMyLink, {
    success: "linkUpdated",
    error: "linkUpdateError",
  });
}

export function useDeleteMyLink() {
  return useLinkMutation(deleteMyLink, {
    success: "linkDeleted",
    error: "linkDeleteError",
  });
}
