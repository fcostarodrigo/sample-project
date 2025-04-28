// Thin wrapper around the Fetch API avoiding common pitfalls and better error messages

export type RequestMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";
export interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  method?: RequestMethod;
  responseBodyType?: ResponseBodyType;
  url: string;
}

export type ResponseBodyType = "fetch" | "json";

type FetchResponse = Awaited<ReturnType<typeof fetch>>;

interface Request {
  body?: File | FormData | string;
  headers: Record<string, string>;
  method: RequestMethod;
  url: string;
}

interface RequestErrorOptions {
  cause?: unknown;
  message: string;
  request: Request;
  response?: Response;
}

interface Response {
  body?: unknown;
  headers: Record<string, string>;
  status: number;
}

export class RequestError extends Error {
  request: Request;
  response?: Response;

  constructor({ cause, message, request, response }: RequestErrorOptions) {
    super(message, { cause });
    this.request = request;
    this.response = response;
  }
}

export async function getResponse(requestOptions: RequestOptions) {
  const request = createRequest(requestOptions);

  const fetchResponse = await fetch(request.url, {
    body: request.body,
    headers: request.headers,
    method: request.method,
  }).catch((error: unknown) => {
    const message = "Error getting a response from a request";

    throw new RequestError({ cause: error, message, request });
  });

  const response: Response = {
    headers: Object.fromEntries(fetchResponse.headers.entries()),
    status: fetchResponse.status,
  };

  if (!fetchResponse.ok) {
    const message = `${request.method} ${request.url} ${String(response.status)}`;

    // In case of error, some APIs return useful information in different text formats.
    response.body = await fetchResponse.text().catch(() => "No text response body");
    throw new RequestError({ message, request, response });
  }

  response.body = await getResponseBody(fetchResponse, requestOptions);

  return response;
}

export async function sendRequest(options: RequestOptions): Promise<unknown> {
  const response = await getResponse(options);

  return response.body;
}

function createRequest(options: RequestOptions): Request {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = {
    "User-Agent": navigator.userAgent, // In node where the user agent is not automatically set, some APIs require a User-Agent header
    ...options.headers,
  };

  if (options.body instanceof File) {
    if (!("Content-Type" in headers)) {
      throw new TypeError("File request body requires a Content-Type header");
    }

    return {
      body: options.body,
      headers,
      method,
      url: options.url,
    };
  }

  if (options.body instanceof FormData) {
    if ("Content-Type" in headers) {
      throw new TypeError("The Content-Type request header should be filled automatically for FormData request body");
    }

    return {
      body: options.body,
      headers,
      method,
      url: options.url,
    };
  }

  if (typeof options.body === "object" && options.body !== null) {
    return {
      body: JSON.stringify(options.body),
      headers: { ...headers, "Content-Type": "application/json" },
      method,
      url: options.url,
    };
  }

  return { headers, method, url: options.url };
}

async function getResponseBody(fetchResponse: FetchResponse, requestOptions: RequestOptions) {
  if (requestOptions.responseBodyType === "fetch") {
    return fetchResponse;
  }

  if (fetchResponse.headers.get("Content-Type") === null) {
    return;
  }

  return fetchResponse.json();
}
