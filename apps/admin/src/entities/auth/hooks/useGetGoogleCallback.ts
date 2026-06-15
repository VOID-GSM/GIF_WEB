"use client";

import { useMutation } from "@tanstack/react-query";

import { getGoogleCallback } from "../api";

export function useGetGoogleCallback() {
  return useMutation({ mutationFn: getGoogleCallback });
}
