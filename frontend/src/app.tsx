import { ChakraBaseProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { DefaultError } from "./components/DefaultError";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { routes } from "./routes";
import { theme } from "./theme";

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
        <ChakraBaseProvider theme={theme}>
          <RouterProvider router={createBrowserRouter(routes)} />
          <ReactQueryDevtools initialIsOpen={false} />
        </ChakraBaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
