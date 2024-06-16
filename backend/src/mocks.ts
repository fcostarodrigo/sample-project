import { APIGatewayProxyEvent } from "aws-lambda";
import { vi } from "vitest";

export function mockContext() {
  return {
    awsRequestId: "1234abc-1234abc-1234abc-1234abc-1234abc",
    callbackWaitsForEmptyEventLoop: false,
    clientContext: undefined,
    done: vi.fn(),
    fail: vi.fn(),
    functionName: "SampleStack-saveWebPushSubscriptionLambda1234abc-1234abc",
    functionVersion: "$LATEST",
    getRemainingTimeInMillis: vi.fn(),
    identity: undefined,
    invokedFunctionArn:
      "arn:aws:lambda:et-mars-1:123456789:function:SampleStack-saveWebPushSubscriptionLambda1234abc-1234abc",
    logGroupName: "/aws/lambda/SampleStack-saveWebPushSubscriptionLambda1234abc-1234abc",
    logStreamName: "2024/06/09/[$LATEST]1234abc1234abc1234abc1234abc",
    memoryLimitInMB: "128",
    succeed: vi.fn() as never,
  };
}

export function mockAPIGatewayProxyEvent(body: string, path: string, method = "POST"): APIGatewayProxyEvent {
  return {
    body,
    headers: {
      Host: "1234abc.execute-api.us-east-1.amazonaws.com",
      "User-Agent": "Amazon CloudFront",
      Via: "2.0 1234abc1234abc1234abc1234abc.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "1234abc1234abc1234abc1234abc1234abc1234abc1234abc==",
      "X-Amzn-Trace-Id": "Root=1-1234abc-1234abc1234abc1234abc",
      "X-Forwarded-For": "203.0.113.0, 203.0.113.0",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
      "cache-control": "no-cache",
      "content-type": "text/plain;charset=UTF-8",
      origin: "https://1234abc.cloudfront.net",
      pragma: "no-cache",
    },
    httpMethod: method,
    isBase64Encoded: false,
    multiValueHeaders: {
      Host: ["1234abc.execute-api.us-east-1.amazonaws.com"],
      "User-Agent": ["Amazon CloudFront"],
      Via: ["2.0 1234abc1234abc1234abc1234abc.cloudfront.net (CloudFront)"],
      "X-Amz-Cf-Id": ["1234abc1234abc1234abc1234abc1234abc1234abc1234abc=="],
      "X-Amzn-Trace-Id": ["Root=1-1234abc-1234abc1234abc1234abc"],
      "X-Forwarded-For": ["203.0.113.0, 203.0.113.0"],
      "X-Forwarded-Port": ["443"],
      "X-Forwarded-Proto": ["https"],
      "cache-control": ["no-cache"],
      "content-type": ["text/plain;charset=UTF-8"],
      origin: ["https://1234abc.cloudfront.net"],
      pragma: ["no-cache"],
    },
    multiValueQueryStringParameters: null,
    path: `/${path}`,
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
      accountId: "123456789",
      apiId: "1234abc",
      authorizer: undefined,
      domainName: "1234abc.execute-api.us-east-1.amazonaws.com",
      domainPrefix: "1234abc",
      extendedRequestId: "1234abc1234abc=",
      httpMethod: "POST",
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: "203.0.113.0",
        user: null,
        userAgent: "Amazon CloudFront",
        userArn: null,
      },
      path: `/api/${path}`,
      protocol: "HTTP/1.1",
      requestId: "1234abc-1234abc-1234abc-1234abc-1234abc",
      requestTime: "09/Jun/2024:21:35:40 +0000",
      requestTimeEpoch: 1_717_968_940_516,
      resourceId: "1234abc",
      resourcePath: `/${path}`,
      stage: "api",
    },
    resource: `/${path}`,
    stageVariables: null,
  };
}

export function mockSaveWebPushSubscriptionEvent() {
  return mockAPIGatewayProxyEvent(JSON.stringify({}), "web-push-notifications", "POST");
}

export function mockSendMessageEvent() {
  return mockAPIGatewayProxyEvent(JSON.stringify({}), "messages", "POST");
}
