"use client";

import { useQuery } from "@tanstack/react-query";

import { getRetrospectives } from "../api/retrospectiveApi";
import type { RetrospectiveQueryParams } from "../model/type";

export const RETROSPECTIVE_QUERY_KEY = ["retrospective"];

export function useGetRetrospectives({
  mineOnly,
  ...serverParams
}: RetrospectiveQueryParams = {}) {
  // mineOnly는 서버 파라미터가 없어 받은 목록을 프론트에서 거른다.
  // queryKey에 넣으면 토글할 때마다 같은 목록을 다시 불러오므로 서버로 보내는 값만 넣는다.
  const query = useQuery({
    queryKey: [...RETROSPECTIVE_QUERY_KEY, "list", serverParams],
    queryFn: () => getRetrospectives(serverParams),
  });

  const data =
    query.data?.content.filter((item) => !mineOnly || item.isMine) ?? [];

  return { ...query, data };
}
