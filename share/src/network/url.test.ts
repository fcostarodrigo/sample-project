import { describe, expect, it } from "vitest";

import { formatPath, formatUrl, parseUrl } from "./url.js";

describe(formatUrl, () => {
  it("add path to an url", () => {
    const options = { path: "sp/cities/bauru", url: "https://www.example.com/states" };
    const url = "https://www.example.com/states/sp/cities/bauru";

    expect(formatUrl(options)).toBe(url);
  });

  it("add query string to an URL", () => {
    const options = { query: { role: "admin" }, url: "https://www.example.com/?user=rodrigo" };
    const url = "https://www.example.com/?user=rodrigo&role=admin";

    expect(formatUrl(options)).toBe(url);
  });

  it("format a full URL", () => {
    const url = "https://www.example.com:80/states/sp?q=bauru";
    const options = {
      domain: "www.example.com",
      path: "/states/sp",
      port: 80,
      protocol: "https:",
      query: { q: "bauru" },
    };

    expect(formatUrl(options)).toBe(url);
  });

  it("should be the reverse of parseUrl", () => {
    const url = "https://www.example.com:80/states/sp?q=bauru";

    expect(formatUrl(parseUrl(url))).toBe(url);
  });
});

describe(parseUrl, () => {
  it("should parse a full URL", () => {
    const url = "https://www.example.com:80/states/sp?q=bauru";
    const options = {
      domain: "www.example.com",
      path: "/states/sp",
      port: 80,
      protocol: "https:",
      query: { q: "bauru" },
    };

    expect(parseUrl(url)).toStrictEqual(options);
  });

  it("should be the reverse of formatUrl", () => {
    const options = {
      domain: "www.example.com",
      path: "/states/sp",
      port: 80,
      protocol: "https:",
      query: { q: "bauru" },
    };

    expect(parseUrl(formatUrl(options))).toStrictEqual(options);
  });
});

describe(formatPath, () => {
  it("should handle extra slashes in the middle", () => {
    expect(formatPath("/test//test")).toBe("/test/test");
  });

  it("should handle extra slashes in the parts", () => {
    expect(formatPath("/test/", "/test")).toBe("/test/test");
  });

  it("should handle extra slash at the end", () => {
    expect(formatPath("/test/test/")).toBe("/test/test");
  });
});
