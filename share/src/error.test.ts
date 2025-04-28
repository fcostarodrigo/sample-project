import { describe, expect, it } from "vitest";

import { errorSerializer } from "./error.js";

describe("errorSerializer", () => {
  it("should serialize error stacks", () => {
    const error = new Error("Ops");
    const result = JSON.stringify(error, errorSerializer, 2);

    expect((JSON.parse(result) as Error).stack).toBeInstanceOf(Array);
  });
});
