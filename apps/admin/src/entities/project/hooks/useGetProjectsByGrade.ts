"use client";
import { useQuery } from "@tanstack/react-query";
import { getProjectsByGrade } from "../api";

export function useGetProjectsByGrade(grade: number) {
  return useQuery({
    queryKey: ["project", "filter", grade],
    queryFn: () => getProjectsByGrade(grade).then((res) => res.data),
  });
}
