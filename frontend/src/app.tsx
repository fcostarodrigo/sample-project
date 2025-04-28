import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DefaultError } from "./components/default-error";
import { ErrorBoundary } from "./components/error-boundary";
import { routes } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError: true,
    },
    queries: {
      throwOnError: true,
    },
  },
});

export function App() {
  return (
    <ErrorBoundary fallbackComponent={DefaultError}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <RouterProvider router={createBrowserRouter(routes)} />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
