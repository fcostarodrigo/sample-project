import type { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import type { Construct } from "constructs";

import { CfnOutput } from "aws-cdk-lib";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, type NodejsFunctionProps, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";

export function makeApi(options: {
  api: HttpApi;
  extraNodeJsFunctionProps?: NodejsFunctionProps;
  filePath: string;
  method: keyof typeof HttpMethod;
  name: string;
  nodeModules?: string[];
  path: string;
  region: string;
  scope: Construct;
}): NodejsFunction {
  const lambda = new NodejsFunction(options.scope, `${options.name}Lambda`, {
    ...getNodeJsFunctionProperties(options.nodeModules),
    entry: options.filePath,
  });

  new CfnOutput(options.scope, `${options.name}LambdaLogs`, {
    value: `https://${options.region}.console.aws.amazon.com/cloudwatch/home?region=${options.region}#logsV2:log-groups/log-group/${encodeURIComponent("/aws/lambda/")}${lambda.functionName}`,
  });

  options.api.addRoutes({
    integration: new HttpLambdaIntegration(`${options.name}Integration`, lambda),
    methods: [HttpMethod[options.method]],
    path: options.path,
  });

  return lambda;
}

function getNodeJsFunctionProperties(nodeModules: string[] = []): NodejsFunctionProps {
  return {
    bundling: {
      externalModules: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb", "@aws-sdk/client-secrets-manager"],
      format: OutputFormat.ESM,
      minify: true,
      nodeModules,
      sourceMap: true,
    },
    environment: { NODE_OPTIONS: "--enable-source-maps" },
    runtime: Runtime.NODEJS_LATEST,
  };
}
