"use client";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState, type PropsWithChildren } from "react";

import { AuthProvider } from "@/context/auth-context";

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Client errors (4xx) won't succeed on retry — only retry network/server failures.
  if (isAxiosError(error) && error.response && error.response.status < 500) {
    return false;
  }
  return failureCount < 3;
}

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: shouldRetry },
        },
      })
  );

  return (
    <MantineProvider>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
