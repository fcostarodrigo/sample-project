import { describe, expect, it } from "vitest";
import { z } from "zod";

import { sendRequest } from "./request.js";

describe("sendRequest", () => {
  it("should make a json request", async () => {
    const url = "https://api.github.com/repos/fcostarodrigo/sample-project";
    const schema = z.object({ id: z.number() });

    const { id } = schema.parse(await sendRequest({ url }));

    expect(id).toBe(816_043_618);
  });
});
