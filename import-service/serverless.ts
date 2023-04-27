import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: {
        allowedOrigins: ["*"],
        allowedHeaders: ["Content-Type", "Authorization"],
        allowedMethods: ["OPTIONS","POST","GET", "PUT"],
        maxAge: 600,
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: 'nuts-store-upload',
      BUCKET_PREFIX: 'uploaded',
      BUCKET_IMPORTED_PREFIX: 'imported',
      SQS_URL: 'https://sqs.eu-west-1.amazonaws.com/409523970601/catalogItemsQueue',
      REGION: 'eu-west-1'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "s3:ListBucket"
            ],
            Resource: "arn:aws:s3:::arn:aws:s3:::nuts-store-upload"
          },
          {
            Effect: "Allow",
            Action: [
              "s3:*"
            ],
            Resource: "arn:aws:s3:::nuts-store-upload/*"
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:*'
            ],
            Resource: [
              'arn:aws:sqs:eu-west-1:409523970601:catalogItemsQueue'
            ]
          },
        ]
      }
    },
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          StatusCode: '401'
        }
      },
      GatewayResponseForbidden: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          },
          StatusCode: '403'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
