import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { webPushNotificationKeysSecretName } from "share";
import { build } from "vite";
import webPush from "web-push";

const client = new SecretsManagerClient({});

async function getWebPushNotificationPublicKey() {
  const command = new GetSecretValueCommand({
    SecretId: webPushNotificationKeysSecretName,
  });

  const response = await client.send(command);

  if (typeof response.SecretString === "string") {
    return (JSON.parse(response.SecretString) as webPush.VapidKeys).publicKey;
  }

  throw new Error("Secret doesn't have a SecretString");
}

process.env.VITE_WEB_PUSH_NOTIFICATION_PUBLIC_KEY = await getWebPushNotificationPublicKey();

await build({
  root: "../frontend",
});
