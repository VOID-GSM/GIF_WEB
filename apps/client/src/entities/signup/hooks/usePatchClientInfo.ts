"use client";

import { useMutation } from "@tanstack/react-query";

import { patchClientInfo } from "../api";

export function usePatchClientInfo() {
  return useMutation({ mutationFn: patchClientInfo });
}
