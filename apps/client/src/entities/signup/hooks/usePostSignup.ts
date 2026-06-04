"use client";

import { useMutation } from "@tanstack/react-query";

import { postSignup } from "../api";

export function usePostSignup() {
  return useMutation({ mutationFn: postSignup });
}
