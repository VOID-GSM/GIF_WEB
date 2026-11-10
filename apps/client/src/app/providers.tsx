"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState } from "react";
import { ThemeProvider } from "@repo/ui";

import { registerExternalForbiddenHandler } from "@/shared/api/externalForbiddenHandler";

// 하위 컴포넌트의 첫 요청보다 먼저 등록되도록 모듈 로드 시점에 한 번 등록한다.
registerExternalForbiddenHandler();

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
      }),
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
