import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { subscribeApi } from "share";

import { makeHandler } from "../handler.js";
import { created } from "../responses.js";

const database = DynamoDBDocument.from(new DynamoDB());

export const subscribeFilePath = fileURLToPath(import.meta.url);

export const handler = makeHandler(subscribeApi, async ({ body }) => {
  const subscription = {
    subscriptionId: crypto.randomUUID(),
    subscriptionParams: body.subscriptionParams,
  };

  await database.put({ Item: subscription, TableName: "subscriptionsTable" });

  return created(subscription);
});
