"use client";

import { useMutation } from "@tanstack/react-query";

import { postFormSubmit } from "../api/api";

export function usePostFormSubmit() {
  return useMutation({ mutationFn: postFormSubmit });
}
