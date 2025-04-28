import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { setup } from "../test-utils/setup.tsx";
import { hasServiceWorker } from "./notification-browser-api.ts";
import { ServiceWorkerCheck } from "./service-worker-check.tsx";

vi.mock("./notification-browser-api");

const hasServiceWorkerMock = vi.mocked(hasServiceWorker);

describe("Service Worker Check", () => {
  it("should render children if service worker is available", () => {
    hasServiceWorkerMock.mockReturnValue(true);

    setup(
      <ChakraProvider value={defaultSystem}>
        <ServiceWorkerCheck>
          <div data-testid="children"></div>
        </ServiceWorkerCheck>
      </ChakraProvider>,
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  it("should not render children if service worker is not available", () => {
    hasServiceWorkerMock.mockReturnValue(false);

    setup(
      <ChakraProvider value={defaultSystem}>
        <ServiceWorkerCheck>
          <div data-testid="children"></div>
        </ServiceWorkerCheck>
      </ChakraProvider>,
    );

    expect(screen.queryByTestId("children")).not.toBeInTheDocument();
  });
});
