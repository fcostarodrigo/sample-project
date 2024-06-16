import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { webPushNotificationKeysSecretName } from "share";
import webPush from "web-push";

const client = new SecretsManagerClient({});

export async function getWebPushNotificationSecret() {
  const command = new GetSecretValueCommand({
    SecretId: webPushNotificationKeysSecretName,
  });

  const response = await client.send(command);

  if (typeof response.SecretString === "string") {
    return JSON.parse(response.SecretString) as webPush.VapidKeys;
  }

  throw new Error("Secret doesn't have a SecretString");
}
