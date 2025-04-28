import { CreateSecretCommand, ResourceExistsException, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { notificationSecretKey } from "share";
import webPush from "web-push";

const client = new SecretsManagerClient({});

const vapidKeys = webPush.generateVAPIDKeys();

const command = new CreateSecretCommand({
  Name: notificationSecretKey,
  SecretString: JSON.stringify(vapidKeys),
});

try {
  await client.send(command);
} catch (error) {
  if (!(error instanceof ResourceExistsException)) {
    throw error;
  }
}
