import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { fileURLToPath } from "node:url";
import { EndpointOptions, saveWebPushSubscriptionBodySchema } from "share";

import { makeHandler } from "../handler.js";
import { created } from "../responses.js";

export const saveWebPushSubscriptionEndpoint: EndpointOptions = {
  filePath: fileURLToPath(import.meta.url),
  methods: ["POST"],
  name: "saveWebPushSubscription",
  path: "/web-push-subscriptions",
};

const db = DynamoDBDocument.from(new DynamoDB());

export const handler = makeHandler({
  bodySchema: saveWebPushSubscriptionBodySchema,
  handlerFun: async ({ body }) => {
    const item = {
      webPushSubscription: body.webPushSubscription,
      webPushSubscriptionId: crypto.randomUUID(),
    };

    await db.put({ Item: item, TableName: "webPushSubscriptionsTableV2" });
    return created(item);
  },
});
