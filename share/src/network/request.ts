/**
 * Thin fetch wrapper
 *
 * Better error message.
 * Parse based on content type.
 * Pass through response.
 * Typed Body.
 * Just body return.
 */

export type RequestMethod = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";

type FetchRequestBody = Exclude<Parameters<typeof fetch>[1], undefined>["body"];
type FetchResponse = Awaited<ReturnType<typeof fetch>>;

interface Request<RequestBody> {
  body?: RequestBody;
  headers: Record<string, string>;
  method: RequestMethod;
  url: string;
}

interface Response<ResponseBody> {
  body?: ResponseBody;
  headers?: Record<string, string>;
  status?: number;
}

interface RequestErrorOptions<RequestBody, ResponseBody> {
  cause?: unknown;
  message: string;
  request: Request<RequestBody>;
  response?: Response<ResponseBody>;
}

interface RequestOptions<RequestBody> {
  body?: RequestBody;
  headers?: Record<string, string>;
  method?: RequestMethod;
  passThroughResponse?: boolean;
  url: string;
}

class RequestError<RequestBody, ResponseBody> extends Error {
  public request: Request<RequestBody>;
  public response?: Response<ResponseBody>;

  constructor({ cause, message, request, response }: RequestErrorOptions<RequestBody, ResponseBody>) {
    super(message, { cause });
    this.name = "RequestError";
    this.request = request;
    this.response = response;
  }
}

function updateRequestBody<RequestBody>(request: Request<RequestBody>, options: RequestOptions<RequestBody>) {
  if (options.body instanceof FormData || options.body instanceof File) {
    request.body = options.body;
    return;
  }

  if (options.body) {
    request.body = JSON.stringify(options.body) as RequestBody;
    request.headers["Content-Type"] = "application/json";
  }
}

function getDefaultRequest<RequestBody>(options: RequestOptions<RequestBody>): Request<RequestBody> {
  return {
    headers: {
      "User-Agent": "Rodrigo script",
      ...options.headers,
    },
    method: options.method ?? "GET",
    url: options.url,
  };
}

async function getResponse<RequestBody, ResponseBody>(request: Request<RequestBody>) {
  try {
    const fetchOptions = {
      body: request.body as FetchRequestBody,
      headers: request.headers,
      method: request.method,
    } as const;

    const fetchResponse = await fetch(request.url, fetchOptions);

    return {
      fetchResponse,
      response: {
        headers: Object.fromEntries(fetchResponse.headers.entries()),
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
      } as Response<ResponseBody>,
    };
  } catch (error) {
    const message = "Error getting a response from a request";
    throw new RequestError({ cause: error, message, request });
  }
}

interface UpdateResponseBodyOptions<RequestBody, ResponseBody> {
  fetchResponse: FetchResponse;
  request: Request<RequestBody>;
  requestOptions: RequestOptions<RequestBody>;
  response: Response<ResponseBody>;
}

async function jsonParser<RequestBody, ResponseBody>(
  options: UpdateResponseBodyOptions<RequestBody, ResponseBody>,
): Promise<ResponseBody> {
  return (await options.fetchResponse.json()) as ResponseBody;
}

async function textParser<RequestBody, ResponseBody>(
  options: UpdateResponseBodyOptions<RequestBody, ResponseBody>,
): Promise<ResponseBody> {
  return (await options.fetchResponse.text()) as ResponseBody;
}

const parsers = {
  "application/json": jsonParser,
  "text/plain": textParser,
} as const;

async function updateResponseBody<RequestBody, ResponseBody>(
  options: UpdateResponseBodyOptions<RequestBody, ResponseBody>,
) {
  const { fetchResponse, request, requestOptions, response } = options;

  if (requestOptions.passThroughResponse) {
    response.body = fetchResponse as ResponseBody;
    return;
  }

  const contentType = fetchResponse.headers.get("Content-Type");

  if (!contentType) {
    return;
  }

  try {
    for (const [contentType, parser] of Object.entries(parsers)) {
      if (contentType.includes(contentType)) {
        response.body = await parser(options);
        return;
      }
    }

    response.body = await textParser(options);
  } catch (error) {
    const message = "Error parsing response body";
    throw new RequestError({ cause: error, message, request, response });
  }
}

async function getRequest<ResponseBody, RequestBody>(options: RequestOptions<RequestBody>) {
  const request = getDefaultRequest(options);
  updateRequestBody(request, options);

  const { fetchResponse, response } = await getResponse<RequestBody, ResponseBody>(request);
  await updateResponseBody({ fetchResponse, request, requestOptions: options, response });

  return { fetchResponse, request, response };
}

export async function fullRequest<ResponseBody, RequestBody = unknown>(options: RequestOptions<RequestBody>) {
  const { response } = await getRequest<ResponseBody, RequestBody>(options);
  return response;
}

export async function request<ResponseBody, RequestBody = unknown>(options: RequestOptions<RequestBody>) {
  const { fetchResponse, request, response } = await getRequest<ResponseBody, RequestBody>(options);

  if (!fetchResponse.ok) {
    const message = `Request failed: ${request.method} ${request.url} ${String(response.status)}`;
    throw new RequestError({ message, request, response });
  }

  return response.body as ResponseBody;
}
