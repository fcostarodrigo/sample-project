/**
 * Auxiliary URL functions.
 *
 * Avoid missing or extra slash errors.
 * Use JavaScript runtime to parse and format URLs.
 * Allow modifying an existing URL safely.
 */

interface ParsedUrl {
  domain: string;
  path: string;
  port?: number;
  protocol: string;
  query: Record<string, string>;
}

interface UrlOptions {
  domain?: string;
  path?: string;
  port?: number;
  protocol?: string;
  query?: Record<string, string>;
  url?: string;
}

export function formatPath(...paths: string[]): string {
  return `/${paths
    .join("/")
    .split("/")
    .map((x) => x.trim())
    .filter(Boolean)
    .join("/")}`;
}

export function formatUrl(options: UrlOptions = {}): string {
  const url = new URL(options.url ?? "https://www.example.com");

  url.protocol = options.protocol ?? url.protocol;
  url.hostname = options.domain ?? url.hostname;
  url.port = options.port ? String(options.port) : url.port;
  url.pathname = options.path ? formatPath(url.pathname, options.path) : url.pathname;
  url.search = new URLSearchParams({
    ...Object.fromEntries(url.searchParams),
    ...Object.fromEntries(new URLSearchParams(options.query ?? {})),
  }).toString();

  return url.toString();
}

export function parseUrl(urlString: string): ParsedUrl {
  try {
    const url = new URL(urlString);

    return {
      domain: url.hostname,
      path: url.pathname,
      port: url.port ? Number(url.port) : undefined,
      protocol: url.protocol,
      query: Object.fromEntries(url.searchParams),
    };
  } catch (error: unknown) {
    throw new Error(`${urlString} is not a valid URL`, { cause: error });
  }
}
