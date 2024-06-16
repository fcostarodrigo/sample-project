import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { fileURLToPath } from "node:url";
import { EndpointOptions, sendMessageBodySchema, webPushSubscriptionItemSchema } from "share";
import webPush from "web-push";

import { makeHandler } from "../handler.js";
import { ok } from "../responses.js";
import { getWebPushNotificationSecret } from "../webPushNotification.js";

export const sendMessageEndpoint: EndpointOptions = {
  filePath: fileURLToPath(import.meta.url),
  methods: ["POST"],
  name: "sendMessage",
  path: "/messages",
};

const db = DynamoDBDocument.from(new DynamoDB());
const vapidKeys = await getWebPushNotificationSecret();

webPush.setVapidDetails("mailto:user@example.com", vapidKeys.publicKey, vapidKeys.privateKey);

export const handler = makeHandler({
  bodySchema: sendMessageBodySchema,
  handlerFun: async ({ body }) => {
    const { Items: items = [] } = await db.scan({
      TableName: "webPushSubscriptionsTableV2",
    });

    const invalidSubscriptionsIds: string[] = [];

    await Promise.all(
      items.map((item) => {
        const webPushSubscriptionItem = webPushSubscriptionItemSchema.safeParse(item);

        if (!webPushSubscriptionItem.success) {
          throw new Error("Invalid webPushSubscription in the database");
        }

        return webPush.sendNotification(webPushSubscriptionItem.data.webPushSubscription, body.message).catch(() => {
          invalidSubscriptionsIds.push(webPushSubscriptionItem.data.webPushSubscriptionId);
        });
      }),
    );

    if (invalidSubscriptionsIds.length > 0) {
      await db.batchWrite({
        RequestItems: {
          webPushSubscriptionsTableV2: invalidSubscriptionsIds.map((id) => ({
            DeleteRequest: {
              Key: { webPushSubscriptionId: id },
            },
          })),
        },
      });
    }

    return ok("ok");
  },
});
