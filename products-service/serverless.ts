import type { AWS } from '@serverless/typescript';

import getAllProducts from '@functions/getAllProducts';
import getProductById from '@functions/getProductById';
import dynamoResouses from '@db/resourses';
import createProduct from '@functions/createProduct';

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
      PRODUCTS_TABLE: 'productsTable',
      PRODUCTS_STOCK_TABLE: 'productsStockTable',
      ALLOW_ORIGIN: '*',
    },
  },
  // import the function via paths
  functions: { getAllProducts, getProductById, createProduct },
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
      ...dynamoResouses
    }
  }
};

module.exports = serverlessConfiguration;
