#!/usr/bin/env node
import cdk from "aws-cdk-lib";

import { SampleStack } from "./SampleStack.js";

const app = new cdk.App();
new SampleStack(app, "SampleStack", {
  tags: {
    project: "sample",
  },
});
