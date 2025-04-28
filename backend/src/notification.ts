import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { type NotificationSecret, notificationSecretKey, notificationSecretSchema } from "share";

const client = new SecretsManagerClient({});

export async function getNotificationSecret(): Promise<NotificationSecret> {
  const command = new GetSecretValueCommand({
    SecretId: notificationSecretKey,
  });

  const response = await client.send(command);

  if (typeof response.SecretString !== "string") {
    throw new TypeError("Web push notification secret doesn't have a SecretString");
  }

  return notificationSecretSchema.parse(JSON.parse(response.SecretString));
}
