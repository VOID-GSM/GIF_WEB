"use client";

import { useMutation } from "@tanstack/react-query";
import { patchFormSubmit } from "../api/api";

export function usePatchFormSubmit() {
  return useMutation({
    mutationFn: patchFormSubmit,
  });
}
