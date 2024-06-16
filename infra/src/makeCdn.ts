import { CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginAccessIdentity,
  ResponseHeadersPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CacheControl } from "aws-cdk-lib/aws-codepipeline-actions";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export function makeCdn(scope: Construct, apiUrl: string) {
  const frontendBucket = new Bucket(scope, "sampleFrontendBucket", {
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  // Add list permission to allow 404 errors from S3 to CloudFront
  const originAccessIdentity = new OriginAccessIdentity(scope, "OAI");
  frontendBucket.grantRead(originAccessIdentity);

  const behaviorOptions = {
    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    compress: true,
    origin: new S3Origin(frontendBucket, { originAccessIdentity }),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  };

  const distribution = new Distribution(scope, "sampleDist", {
    additionalBehaviors: {
      "*.html": {
        ...behaviorOptions,
        responseHeadersPolicy: new ResponseHeadersPolicy(scope, "indexResponseHeaderPolicy", {
          customHeadersBehavior: {
            customHeaders: [{ header: "Cache-Control", override: true, value: "max-age=60" }],
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
