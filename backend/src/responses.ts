import { APIGatewayProxyResult } from "aws-lambda";
import { errorSerializer } from "share";

function makeResponse(statusCode: number) {
  return (body: unknown, options?: Omit<APIGatewayProxyResult, "body" | "statusCode">): APIGatewayProxyResult => ({
    body: JSON.stringify(body, errorSerializer),
    statusCode,
    ...options,
  });
}

export const internalServerError = makeResponse(500);
export const badRequest = makeResponse(400);
export const ok = makeResponse(200);
export const created = makeResponse(201);
export const notFound = makeResponse(404);
export const conflict = makeResponse(409);
export const unauthorized = makeResponse(401);
export const forbidden = makeResponse(403);
