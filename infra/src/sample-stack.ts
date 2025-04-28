import type { Construct } from "constructs";

import cdk from "aws-cdk-lib";
import dynamodb from "aws-cdk-lib/aws-dynamodb";
import secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { notificationSecretKey } from "share";

import { makeApis } from "./make-apis.js";
import { makeCdn } from "./make-cdn.js";

export class SampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, properties?: cdk.StackProps) {
    super(scope, id, properties);

    const { region } = this;

    const { apiUrl, sendMessageLambda, subscribeLambda } = makeApis(this, region);

    const notificationSecrete = secretsmanager.Secret.fromSecretNameV2(
      this,
      "notificationSecret",
      notificationSecretKey,
    );

    notificationSecrete.grantRead(sendMessageLambda);

    const subscriptionsTable = new dynamodb.Table(this, "subscriptionsTable", {
      partitionKey: {
        name: "subscriptionId",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "subscriptionsTable",
    });

    subscriptionsTable.grantWriteData(subscribeLambda);
    subscriptionsTable.grantReadWriteData(sendMessageLambda);

    makeCdn(this, apiUrl);
  }
}
