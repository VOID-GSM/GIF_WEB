"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllTeachers } from "../api/teacherApi";

export function useGetAllTeachers(enabled = true) {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
    enabled,
  });
}
