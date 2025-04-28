import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { fileURLToPath } from "node:url";
import { sendMessageApi, subscriptionSchema } from "share";
import webPush from "web-push";

import { makeHandler } from "../handler.js";
import { getNotificationSecret } from "../notification.js";
import { ok } from "../responses.js";

const database = DynamoDBDocument.from(new DynamoDB());
const vapidKeys = await getNotificationSecret();

webPush.setVapidDetails("mailto:user@example.com", vapidKeys.publicKey, vapidKeys.privateKey);

export const sendMessageFilePath = fileURLToPath(import.meta.url);

export const handler = makeHandler(sendMessageApi, async ({ body }) => {
  const { Items: items = [] } = await database.scan({
    TableName: "subscriptionsTable",
  });

  const invalidSubscriptionsIds: string[] = [];

  await Promise.all(
    items.map((item) => {
      const subscription = subscriptionSchema.parse(item);

      return webPush.sendNotification(subscription.subscriptionParams, body.message).catch(() => {
        invalidSubscriptionsIds.push(subscription.subscriptionId);
      });
    }),
  );

  if (invalidSubscriptionsIds.length > 0) {
    await database.batchWrite({
      RequestItems: {
        webPushSubscriptionsTableV2: invalidSubscriptionsIds.map((subscriptionId) => ({
          DeleteRequest: {
            Key: { subscriptionId },
          },
        })),
      },
    });
  }

  return ok("ok");
});
