import { apiClient } from "@repo/lib";

import type {
  CatChaseRoundDetail,
  CatChaseRoundSummary,
  StartCatChaseRoundResponse,
  SubmitCatChaseJudgmentsRequest,
} from "../model/types";
import { DEFAULT_CAT_CHASE_GRID_SIZE, inferGridSize } from "../model/constants";

const BASE_URL = "/api/assessment/cat-chase/rounds";

type ServerDate = string | number[] | null | undefined;

// 서버가 LocalDateTime 을 배열([y, m, d, h, mm, s])이나 null 로 내려주는 경우가 있어 문자열로 맞춘다.
const toDateString = (value: ServerDate): string => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value) || value.length === 0) return "";
  const [y, m = 1, d = 1, h = 0, mm = 0, s = 0] = value.map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(mm)}:${pad(s)}`;
};

// 서버의 gridSize 는 전체 칸 수(6x6 → 36)로 내려와서, 화면에서 쓰는 한 변의 칸 수로 바꾼다.
const toBoardSide = (gridSize: number, positions: number[]) => {
  const side = Math.sqrt(gridSize);
  const base = Number.isInteger(side) ? side : DEFAULT_CAT_CHASE_GRID_SIZE;
  return Math.max(base, inferGridSize(positions));
};

export const startCatChaseRound = async () => {
  const { data } = await apiClient.post<StartCatChaseRoundResponse>(BASE_URL);
  return {
    ...data,
    gridSize: toBoardSide(data.gridSize, [
      ...data.mousePositions,
      ...data.catPositions,
    ]),
  };
};

export const submitCatChaseJudgments = async (
  roundId: number,
  body: SubmitCatChaseJudgmentsRequest,
) => {
  await apiClient.post(`${BASE_URL}/${roundId}/judgments`, body);
};

export const getCatChaseRounds = async () => {
  const { data } = await apiClient.get<
    (Omit<CatChaseRoundSummary, "createdAt"> & { createdAt: ServerDate })[]
  >(BASE_URL);
  return data.map((round) => ({
    ...round,
    createdAt: toDateString(round.createdAt),
  }));
};

export const getCatChaseRound = async (roundId: number) => {
  const { data } = await apiClient.get<
    Omit<CatChaseRoundDetail, "createdAt"> & { createdAt: ServerDate }
  >(`${BASE_URL}/${roundId}`);
  return {
    ...data,
    responses: data.responses ?? [],
    createdAt: toDateString(data.createdAt),
  };
};
