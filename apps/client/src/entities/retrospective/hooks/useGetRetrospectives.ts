"use client";

import { useQuery } from "@tanstack/react-query";

import { getRetrospectives } from "../api/retrospectiveApi";
import type { RetrospectiveQueryParams } from "../model/type";

export const RETROSPECTIVE_QUERY_KEY = ["retrospective"];

export function useGetRetrospectives(params: RetrospectiveQueryParams = {}) {
  const query = useQuery({
    queryKey: [...RETROSPECTIVE_QUERY_KEY, "list", params],
    queryFn: () => getRetrospectives(params),
  });

  const data =
    query.data?.content.filter(
      (item) =>
        (!params.bookmarkedOnly || item.isBookmarked) &&
        (!params.mineOnly || item.isMine),
    ) ?? [];

  return { ...query, data };
}
