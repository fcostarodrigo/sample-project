import type { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import type { Api } from "share";

import { log } from "./log.js";
import { badRequest, internalServerError } from "./responses.js";

type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
) => Promise<APIGatewayProxyResult>;

export function makeHandler<RequestParams, RequestBody, ResponseBody>(
  api: Api<RequestParams, RequestBody, ResponseBody>,
  handlerFun: (handlerOptions: { body: RequestBody }) => APIGatewayProxyResult | Promise<APIGatewayProxyResult>,
): ApiGatewayHandler {
  return async (event, context): Promise<APIGatewayProxyResult> => {
    log({ context, event });

    let body: null | RequestBody;

    try {
      body = api.parseRequestBody(JSON.parse(event.body ?? "{}"));
    } catch (error) {
      const response = badRequest(error);
      log({ response });
      return response;
    }

    try {
      const response = await handlerFun({ body });
      log({ response });
      return response;
    } catch (error) {
      // TODO: Only send back the full error in dev.
      const response = internalServerError(error);
      log({ error, response });
      return response;
    }
  };
}
