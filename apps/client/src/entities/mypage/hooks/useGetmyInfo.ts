"use client";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "@/entities/auth/api";

export function useGetMyInfo() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await getMyInfo();
      return data;
    },
  });
}
