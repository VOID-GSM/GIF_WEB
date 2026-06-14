"use client";

import { useMutation } from "@tanstack/react-query";
import { announceForm } from "../api";

export function useAnnounceForm() {
  return useMutation({
    mutationFn: announceForm,
  });
}
