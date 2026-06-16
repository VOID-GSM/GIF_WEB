"use client";

import { useMutation } from "@tanstack/react-query";

import { deleteFormUpload } from "../api/api";

export function useDeleteFormUpload() {
  return useMutation({ mutationFn: deleteFormUpload });
}
