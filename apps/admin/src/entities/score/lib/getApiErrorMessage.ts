interface ApiError {
  response?: { status?: number; data?: { message?: unknown } };
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return (error as ApiError)?.response?.status;
}

// 서버가 내려준 message(검증 실패 사유 등)를 우선 보여주고, 없으면 기본 문구를 쓴다.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as ApiError)?.response?.data?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}
