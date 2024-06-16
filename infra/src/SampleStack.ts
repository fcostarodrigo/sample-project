import cdk from "aws-cdk-lib";
import dynamodb from "aws-cdk-lib/aws-dynamodb";
import secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { webPushNotificationKeysSecretName } from "share";

import { makeApis } from "./makeApis.js";
import { makeCdn } from "./makeCdn.js";

export class SampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const region = this.region;

    const { apiUrl, saveWebPushSubscriptionLambda, sendMessageLambda } = makeApis(this, region);

    const webPushNotificationKeysSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "webPushNotificationKeysSecret",
      webPushNotificationKeysSecretName,
    );

    webPushNotificationKeysSecret.grantRead(sendMessageLambda);

    const subscriptionsTable = new dynamodb.Table(this, "webPushSubscriptionsTableV2", {
      partitionKey: {
        name: "webPushSubscriptionId",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "webPushSubscriptionsTableV2",
    });

    subscriptionsTable.grantWriteData(saveWebPushSubscriptionLambda);
    subscriptionsTable.grantReadWriteData(sendMessageLambda);

    makeCdn(this, apiUrl);
  }
}
