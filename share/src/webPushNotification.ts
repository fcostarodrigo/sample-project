import { z } from "zod";

export const webPushNotificationKeysSecretName = "sample-web-push-notification-keys-secret";

export const webPushSubscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export const saveWebPushSubscriptionBodySchema = z.object({
  webPushSubscription: webPushSubscriptionSchema,
});

export const webPushSubscriptionItemSchema = z.object({
  webPushSubscription: webPushSubscriptionSchema,
  webPushSubscriptionId: z.string(),
});

export const sendMessageBodySchema = z.object({
  message: z.string(),
});
