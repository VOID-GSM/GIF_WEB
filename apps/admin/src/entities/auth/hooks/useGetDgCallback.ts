"use client";

import { useMutation } from "@tanstack/react-query";

import { getDgCallback } from "../api";

export function useGetDgCallback() {
  return useMutation({ mutationFn: getDgCallback });
}
