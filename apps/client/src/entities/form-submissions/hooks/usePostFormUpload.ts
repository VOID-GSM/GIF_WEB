"use client";

import { useMutation } from "@tanstack/react-query";

import { postFormUpload } from "../api";

export function usePostFormUpload() {
  return useMutation({ mutationFn: postFormUpload });
}
