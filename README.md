# Sample

Simple project showing a way to configure a web application using React and AWS in a monorepo.

## Setup

- [Setup node](https://nodejs.org/en)
- [Setup pnpm](https://pnpm.io/installation)
- [Setup AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

Run initially and every time a dependency is changed

```bash
pnpm i
```

When deploying to AWS, make sure you are logged in AWS CLI.

```bash
aws sso login
```

Run only once per AWS account

```bash
pnpm setup
```

## Deploy

```bash
pnpm run deploy
```

## Test

```bash
pnpm test
```

## Monorepo

Each package in the monorepo has its own README file.

Use [filtering](https://pnpm.io/filtering) to run commands on specific packages.

`pnpm --filter frontend run fix` or `pnpm -F frontend run fix`

esbuild is installed in the root package following a [recommendation from aws cdk](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html#local-bundling).

Vitest is installed in the root for better compatibility with vs code plugin.
