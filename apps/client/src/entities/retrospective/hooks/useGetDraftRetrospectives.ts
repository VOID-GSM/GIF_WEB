"use client";

import { useQuery } from "@tanstack/react-query";

import { getDraftRetrospectives } from "../api/retrospectiveApi";

export function useGetDraftRetrospectives() {
  const query = useQuery({
    queryKey: ["retrospective", "draft"],
    queryFn: getDraftRetrospectives,
  });

  return { ...query, data: query.data ?? [] };
}
