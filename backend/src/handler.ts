import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from "aws-lambda";
import { z } from "zod";

import { log } from "./log.js";
import { badRequest, internalServerError } from "./responses.js";

type ApiGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>,
) => Promise<APIGatewayProxyResult>;

interface MakeHandlerOptions<BodySchema extends z.ZodTypeAny> {
  bodySchema?: BodySchema;
  handlerFun: (handlerBodyArg: { body: z.infer<BodySchema> }) => APIGatewayProxyResult | Promise<APIGatewayProxyResult>;
}

export function makeHandler<BodySchema extends z.ZodTypeAny>(
  options: MakeHandlerOptions<BodySchema>,
): ApiGatewayHandler {
  return async (event, context): Promise<APIGatewayProxyResult> => {
    log({ context, event });

    let body: z.infer<BodySchema> = null;

    const runHandler = async () => {
      try {
        const response = await options.handlerFun({ body });

        log({ response });
        return response;
      } catch (error) {
        const response = internalServerError(error);
        log({ error, response });
        return response;
      }
    };

    const logBadRequest = (body: unknown) => {
      const response = badRequest(body);
      log({ response });
      return response;
    };

    if (!options.bodySchema) {
      return runHandler();
    }

    if (event.body === null) {
      return logBadRequest("Request body is required.");
    }

    let jsonParsedBody;

    try {
      jsonParsedBody = JSON.parse(event.body) as unknown;
    } catch {
      return logBadRequest("Request body is not a valid JSON.");
    }

    const parsedBody = options.bodySchema.safeParse(jsonParsedBody);

    if (!parsedBody.success) {
      return logBadRequest(parsedBody.error);
    }

    // https://zod.dev/?id=inferring-the-inferred-type
    body = parsedBody.data as z.infer<BodySchema>;

    return runHandler();
  };
}
