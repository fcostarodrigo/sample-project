import type webPush from "web-push";

import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { notificationSecretKey } from "share";
import { build } from "vite";

const client = new SecretsManagerClient({});

async function getNotificationPublicKey() {
  const command = new GetSecretValueCommand({
    SecretId: notificationSecretKey,
  });

  const response = await client.send(command);

  if (typeof response.SecretString === "string") {
    return (JSON.parse(response.SecretString) as webPush.VapidKeys).publicKey;
  }

  throw new Error("Secret doesn't have a SecretString");
}

process.env.VITE_NOTIFICATION_PUBLIC_KEY = await getNotificationPublicKey();

await build({ root: "../frontend" });
