import type { AWS } from '@serverless/typescript';

import getAllProducts from '@functions/getAllProducts';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'products-service',
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
        allowedHeaders: ["Content-Type"],
        allowedMethods: ["OPTIONS","POST","GET"],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: 'eu-west-1',
      PRODUCTS_TABLE: 'productsTable',
      PRODUCTS_STOCK_TABLE: 'productsStockTable',
      CATALOG_QUEUE_NAME: 'catalogItemsQueue',
      ALLOW_ORIGIN: '*',
      SNS_TOPIC: {
        Ref: 'SNSTopic'
      }
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "sns:*"
            ],
            Resource: {
              Ref: 'SNSTopic'
            }
          }
        ]
      }
    },
  },
  // import the function via paths
  functions: { getAllProducts, getProductById, createProduct, catalogBatchProcess },
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
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'camcoh.ne@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      },
      productsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: 'productsTable',
            AttributeDefinitions: [
                {
                AttributeName: 'id',
                AttributeType: 'S',
                }
            ],
            KeySchema: [
                {
                AttributeName: 'id',
                KeyType: 'HASH',
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
        },
      },
      productsStockTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
              TableName: 'productsStockTable',
              AttributeDefinitions: [
                  {
                  AttributeName: 'id',
                  AttributeType: 'S',
                  }
              ],
              KeySchema: [
                  {
                  AttributeName: 'id',
                  KeyType: 'HASH',
                  }
              ],
              ProvisionedThroughput: {
                  ReadCapacityUnits: 1,
                  WriteCapacityUnits: 1
              },
          },
      }
    },
  }
};

module.exports = serverlessConfiguration;
