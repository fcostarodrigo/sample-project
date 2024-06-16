import { CfnOutput } from "aws-cdk-lib";
import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { RequestMethod } from "share";

export const nodejsFunctionProps: NodejsFunctionProps = {
  bundling: { format: OutputFormat.ESM, minify: true, sourceMap: true },
  environment: { NODE_OPTIONS: "--enable-source-maps" },
  runtime: Runtime.NODEJS_20_X,
};

interface EndpointOptions {
  api: HttpApi;
  extraNodeJsFunctionProps?: NodejsFunctionProps;
  filePath: string;
  methods: RequestMethod[];
  name: string;
  path: string;
  region: string;
  scope: Construct;
}

export function makeEndpoint(options: EndpointOptions) {
  const lambda = new NodejsFunction(options.scope, options.name + "Lambda", {
    ...nodejsFunctionProps,
    ...options.extraNodeJsFunctionProps,
    entry: options.filePath,
  });

  new CfnOutput(options.scope, options.name + "LambdaLogs", {
    value: `https://${options.region}.console.aws.amazon.com/cloudwatch/home?region=${options.region}#logsV2:log-groups/log-group/${encodeURIComponent("/aws/lambda/")}${lambda.functionName}`,
  });

  options.api.addRoutes({
    integration: new HttpLambdaIntegration(options.name + "Integration", lambda),
    methods: options.methods.map((method) => HttpMethod[method]),
    path: options.path,
  });

  return lambda;
}
