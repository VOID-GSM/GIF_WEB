"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProjectFieldAverages } from "../api";

export function useGetAllProjectFieldAverages() {
  return useQuery({
    queryKey: ["score", "field-averages"],
    queryFn: async () => (await getAllProjectFieldAverages()).data,
  });
}
