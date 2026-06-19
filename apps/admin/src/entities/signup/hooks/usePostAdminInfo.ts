"use client";

import { useMutation } from "@tanstack/react-query";

import { postAdminInfo } from "../api";

export function usePostAdminInfo() {
  return useMutation({ mutationFn: postAdminInfo });
}
