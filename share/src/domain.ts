import { z } from "zod";

export const notificationSecretKey = "sampleNotificationSecretKey";

export const notificationSecretSchema = z.object({
  privateKey: z.string(),
  publicKey: z.string(),
});

export type NotificationSecret = z.infer<typeof notificationSecretSchema>;

export const subscriptionParamsSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    auth: z.string(),
    p256dh: z.string(),
  }),
});

export type SubscriptionParams = z.infer<typeof subscriptionParamsSchema>;

export const newSubscriptionSchema = z.object({
  subscriptionParams: subscriptionParamsSchema,
});

export type NewSubscription = z.infer<typeof newSubscriptionSchema>;

export const subscriptionSchema = z.object({
  subscriptionId: z.string(),
  subscriptionParams: subscriptionParamsSchema,
});

export type Subscription = z.infer<typeof subscriptionSchema>;

export const newMessageSchema = z.object({
  message: z.string(),
});

export type NewMessage = z.infer<typeof newMessageSchema>;
