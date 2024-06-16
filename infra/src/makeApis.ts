import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { saveWebPushSubscriptionEndpoint, sendMessageEndpoint } from "backend";
import { Construct } from "constructs";

import { makeEndpoint, nodejsFunctionProps } from "./makeEndpoint.js";

export function makeApis(scope: Construct, region: string) {
  const api = new HttpApi(scope, "sampleApiV2");

  api.addStage("api", {
    autoDeploy: true,
    stageName: "api",
  });

  return {
    api,
    apiUrl: `${api.apiId}.execute-api.${region}.amazonaws.com`,
    saveWebPushSubscriptionLambda: makeEndpoint({ api, region, scope, ...saveWebPushSubscriptionEndpoint }),

    sendMessageLambda: makeEndpoint({
      api,
      region,
      scope,
      ...sendMessageEndpoint,
      extraNodeJsFunctionProps: {
        bundling: {
          ...nodejsFunctionProps.bundling,
          nodeModules: ["web-push"],
        },
      },
    }),
  };
}
