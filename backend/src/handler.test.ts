import { sendMessageApi } from "share";
import { describe, expect, it, vi } from "vitest";

import { makeHandler } from "./handler.js";
import { log } from "./log.js";
import { mockContext, mockSendMessageEvent } from "./mocks.js";
import { internalServerError } from "./responses.js";

vi.mock("./log");

const logMock = vi.mocked(log);

describe("makeHandler", () => {
  it("should log errors", async () => {
    const error = new Error("Ops");

    const handler = makeHandler(sendMessageApi, () => {
      throw error;
    });

    await handler(mockSendMessageEvent(), mockContext(), vi.fn());

    expect(logMock).toHaveBeenCalledWith({ error, response: internalServerError(error) });
  });
});
