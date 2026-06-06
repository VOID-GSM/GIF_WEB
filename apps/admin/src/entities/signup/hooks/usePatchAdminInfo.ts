"use client";

import { useMutation } from "@tanstack/react-query";

import { patchAdminInfo } from "../api";

export function usePatchAdminInfo() {
  return useMutation({ mutationFn: patchAdminInfo });
}
