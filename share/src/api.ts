import {
  type NewMessage,
  newMessageSchema,
  type NewSubscription,
  newSubscriptionSchema,
  subscriptionSchema,
} from "./domain.js";
import { type RequestMethod, type RequestOptions, sendRequest } from "./network/request.js";
import { formatPath } from "./network/url.js";

export interface Api<RequestParams, RequestBody, ResponseBody> extends CommonApi<RequestBody, ResponseBody> {
  sendRequest: (requestParams: RequestParams) => Promise<ResponseBody>;
}

interface ApiOptions<RequestParams, RequestBody, ResponseBody> extends CommonApi<RequestBody, ResponseBody> {
  getRequestParams: (requestParams: RequestParams) => Partial<RequestOptions> & { body: RequestBody };
}

interface CommonApi<RequestBody, ResponseBody> {
  method: RequestMethod;
  name: string;
  parseRequestBody: (requestBody: unknown) => RequestBody;
  parseResponseBody: (responseBody: unknown) => ResponseBody;
  path: string;
}

function createApi<RequestParams, RequestBody, ResponseBody>({
  getRequestParams,
  ...options
}: ApiOptions<RequestParams, RequestBody, ResponseBody>): Api<RequestParams, RequestBody, ResponseBody> {
  return {
    ...options,
    sendRequest: async (requestParams: RequestParams) => {
      return options.parseResponseBody(
        await sendRequest({
          method: options.method,
          url: formatPath("api", options.path),
          ...getRequestParams(requestParams),
        }),
      );
    },
  };
}

export const sendMessageApi = createApi({
  getRequestParams: (newMessage: NewMessage) => ({ body: newMessage }),
  method: "POST",
  name: "sendMessage",
  parseRequestBody: (requestBody: unknown) => newMessageSchema.parse(requestBody),
  parseResponseBody: (responseBody: unknown) => responseBody,
  path: "/messages",
});

export const subscribeApi = createApi({
  getRequestParams: (newSubscription: NewSubscription) => ({ body: newSubscription }),
  method: "POST",
  name: "subscribe",
  parseRequestBody: (requestBody: unknown) => newSubscriptionSchema.parse(requestBody),
  parseResponseBody: (responseBody: unknown) => subscriptionSchema.parse(responseBody),
  path: "/subscriptions",
});
