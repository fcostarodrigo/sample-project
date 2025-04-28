import type { Construct } from "constructs";

import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  AccessLevel,
  AllowedMethods,
  CachePolicy,
  Distribution,
  ResponseHeadersPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CacheControl } from "aws-cdk-lib/aws-codepipeline-actions";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

export function makeCdn(scope: Construct, apiUrl: string): void {
  const frontendBucket = new Bucket(scope, "sampleFrontendBucket", {
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const behaviorOptions = {
    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    compress: true,
    origin: S3BucketOrigin.withOriginAccessControl(frontendBucket, {
      originAccessLevels: [AccessLevel.READ, AccessLevel.LIST],
    }),
    ResponseHeadersPolicy: new ResponseHeadersPolicy(scope, "indexResponseHeaderPolicy", {
      customHeadersBehavior: {
        customHeaders: [{ header: "Cache-Control", override: true, value: "max-age=60" }],
      },
    }),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  };

  const distribution = new Distribution(scope, "sampleDist", {
    additionalBehaviors: {
      "*.*": {
        ...behaviorOptions,
        responseHeadersPolicy: new ResponseHeadersPolicy(scope, "filesResponseHeaderPolicy", {
          customHeadersBehavior: {
            customHeaders: [{ header: "Cache-Control", override: true, value: "max-age=120" }],
          },
        }),
      },
      "api/*": {
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        origin: new HttpOrigin(apiUrl, { originPath: "/" }),
      },
    },
    defaultBehavior: behaviorOptions,
    defaultRootObject: "index.html",
    errorResponses: [{ httpStatus: 404, responseHttpStatus: 200, responsePagePath: "/index.html" }],
    minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
  });

  new CfnOutput(scope, "URL", { value: `https://${distribution.distributionDomainName}` });

  new BucketDeployment(scope, "frontendDeploy", {
    cacheControl: [CacheControl.maxAge(Duration.days(365)), CacheControl.immutable(), CacheControl.setPublic()],
    destinationBucket: frontendBucket,
    distribution,
    distributionPaths: ["/*"],
    prune: true,
    sources: [Source.asset("../frontend/dist")],
  });
}
