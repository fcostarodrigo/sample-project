# Sample

Project showing how to setup and configure a project for a web application with the backend in node and the frontend in React in the same monorepo.

This is also a proof of concept showing if browser's [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) can replace the [WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to broadcast events from the server to the clients as soon as the event happen without pooling.

## Architecture

Monorepo is setup using [pnpm](https://pnpm.io/).

- **frontend**: React application in [React](https://react.dev/) using [Vite](https://vitejs.dev/).
- **backend**: AWS Lambda function using [AWS CDK](https://aws.amazon.com/cdk/) and [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- **infra**: AWS CDK stack for deploying the backend and frontend.
- **share**: Shared code between the packages of the mono repo avoiding node and browser dependencies. Includes the domain model of the application and the APIs specifications.

The API specification is used by the frontend to get a function that do the request to the backend already typed. The type of the request body and response body are properly typed. For the backend, the schema of the request body is used to validate the request. And the infrastructure uses the path and method to configure the API Gateway.

The project is meant to be deployed in AWS CloudFormation. It uses the default region and account that is configured. It creates a stack with all the resources needed to run the application.

![Monorepo architecture diagram](./docs/mono.drawio.svg)

### Web push notification

The idea of using the web push notification API to replace websockets is to take advantage of the mechanism in the browser to handle notifications that initiate the event in the server as opposed to normal API calls that are initiated by the client. In the client, when you subscribe to receive web push notifications, the browser returns an URL served by the browser vendor. The browser vendor, when the API is called, will communicate with the browser application running in the user machine. A public and private VAPID key pair needs to be generated and stored securely because access to the private key allow sending any notifications to the clients registered with that key, that is why it is saved in the AWS Secrets Manager. A service worker is required in the frontend to have a background process that will receive the notifications. In this setup, the frontend code has an event listener for the messages coming from the servicer worker, the handler updates a zustand store that make the application re-render with the new messages.

How those pieces interact is represented below in the sequence diagram. I omitted the responses back from databases and other sources to keep the diagram simple. And instead of listing AWS Lambda and AWS API Gateway as separate entities, I just used the entity "backend"..

![Sequence diagram](./docs/sequence-2.drawio.svg)

The advantage of using web push notifications is that the browser vendor will handle the connection with the browser and the server will not need to keep a connection open for each client. Ths disadvantage is that, since this service is available for free and is meant to be used for notifications alone, it can't be used as general purpose solution since it could be throttle if used too much.

### TypeScript configuration

Tsconfigs with references are used to allow code that is going to be run in the browser to have access to types and globals only available in node and vice-versa. References is a new feature in tsconfig files, a freshly generated vite project will include this strategy as well.

In the root of the monorepo, there are some tsconfig files meant to be extended by the packages in the monorepo.

- `tsconfig.base.json`: Configuration to make type checking more strict.
- `tsconfig.node.json`: Configuration specific for node.
- `tsconfig.test.json`: Configuration specific for vitest, vitest runs on node and depends on some DOM libs.

In each package, there is a main `tsconfig.json` file that references the others configs which extends from the root tsconfig files and include the files of the project.

![TypeScript configuration diagram](./docs/tsconfig.drawio.svg)

## Stack

### Common

- [TypeScript](https://www.typescriptlang.org/): Typed superset of JavaScript.
- [pnpm](https://pnpm.io/): Package manager and monorepo manager.
- [husky](https://typicode.github.io/husky/#/): Git hooks manager.
- [lint-staged](https://www.npmjs.com/package/lint-staged): Run linters on pre-commit hooks.
- [prettier](https://prettier.io/): Code formatter.
- [eslint](https://eslint.org/): Linter.
- [Vitest](https://vitest.dev/): Testing framework.

### Frontend

- [Vite](https://vitejs.dev/): Frontend build tool.
- [React](https://react.dev/): Frontend framework.
- [Chakra UI](https://v2.chakra-ui.com/): UI component library.
- [TanStack Query](https://tanstack.com/query/latest): Data fetching library.
- [React Router](https://reactrouter.com/en/main): Routing library.
- [react-i18next](https://react.i18next.com/): Internationalization library.
- [Zustand](https://zustand-demo.pmnd.rs/): State management library.
- [PWA Vite Plugin](https://vite-plugin-pwa.netlify.app/): Progressive web app support.
- [Testing Library](https://testing-library.com/): Testing library for React.

### Infra

- [AWS CDK](https://aws.amazon.com/cdk/): Infrastructure as code.
- [AWS S3](https://aws.amazon.com/s3/): Object storage service.
- [AWS CloudFront](https://aws.amazon.com/cloudfront/): Content delivery network (CDN).

### Backend

- [AWS Lambda](https://aws.amazon.com/lambda/): Serverless compute service.
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/): NoSQL database service.
- [AWS API Gateway](https://aws.amazon.com/api-gateway/): API management service.
- [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/): JavaScript SDK for AWS services.

## Setup

- [Setup node](https://nodejs.org/en)
- [Setup pnpm](https://pnpm.io/installation)
- [Setup AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

Run initially and every time a dependency is changed.

```bash
pnpm i
```

When deploying to AWS, make sure you are logged in AWS CLI.

```bash
aws sso login
```

Run only once per AWS account

```bash
pnpm run setup
```

## Deploy

```bash
pnpm run deploy
```

## Test

```bash
pnpm run test
```

## Notes

Each package in the monorepo has its own README file.

Use [filtering](https://pnpm.io/filtering) to run commands on specific packages.

`pnpm --filter frontend run fix` or `pnpm -F frontend run fix`

Some packages are installed in the root for compatibility reasons.
