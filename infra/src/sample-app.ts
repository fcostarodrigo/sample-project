import cdk from "aws-cdk-lib";

import { SampleStack } from "./sample-stack.js";

const app = new cdk.App();

new SampleStack(app, "SampleStack", {
  tags: {
    project: "sample",
  },
});
