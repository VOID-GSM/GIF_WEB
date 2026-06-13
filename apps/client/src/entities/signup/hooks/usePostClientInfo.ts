"use client";

import { useMutation } from "@tanstack/react-query";

import { postClientInfo } from "../api";

export function usePostClientInfo() {
  return useMutation({ mutationFn: postClientInfo });
}
