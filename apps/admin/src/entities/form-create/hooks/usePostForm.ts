"use client";

import { useMutation } from "@tanstack/react-query";
import { postForm } from "../api";

export function usePostForm() {
  return useMutation({
    mutationFn: postForm,
  });
}
