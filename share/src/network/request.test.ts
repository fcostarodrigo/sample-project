import { describe, expect, it } from "vitest";

import { request } from "./request.js";

describe(request, () => {
  it("should make a json request", async () => {
    const url = "https://api.github.com/repos/fcostarodrigo/ask";

    const { id } = await request<{ id: string }>({ url });

    expect(id).toBe(460_167_459);
  });
});
