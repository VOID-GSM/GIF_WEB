"use client";

import { useMutation } from "@tanstack/react-query";

import { postSignIn } from "../api";

export function usePostSignIn() {
  return useMutation({ mutationFn: postSignIn });
}
