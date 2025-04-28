import type { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { sendMessageFilePath, subscribeFilePath } from "backend";
import { sendMessageApi, subscribeApi } from "share";

import { makeApi } from "./make-api.js";

interface Apis {
  api: HttpApi;
  apiUrl: string;
  sendMessageLambda: NodejsFunction;
  subscribeLambda: NodejsFunction;
}

export function makeApis(scope: Construct, region: string): Apis {
  const api = new HttpApi(scope, "sampleApiV2");

  api.addStage("api", {
    autoDeploy: true,
    stageName: "api",
  });

  const options = { api, region, scope };

  return {
    api,
    apiUrl: `${api.apiId}.execute-api.${region}.amazonaws.com`,
    sendMessageLambda: makeApi({
      filePath: sendMessageFilePath,
      nodeModules: ["web-push"],
      ...sendMessageApi,
      ...options,
    }),
    subscribeLambda: makeApi({
      filePath: subscribeFilePath,
      ...subscribeApi,
      ...options,
    }),
  };
}
