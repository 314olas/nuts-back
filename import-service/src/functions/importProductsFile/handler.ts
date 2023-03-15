import {S3} from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const fileName = event.queryStringParameters.name || ''

  if (fileName) {
    try {
      const s3 = new S3({region: process.env.REGION});

      const fileUrl = s3.getSignedUrl('putObject', {
        Bucket: process.env.BUCKET_NAME,
        Key: `${process.env.BUCKET_PREFIX}${fileName}`
      })

      return formatJSONResponse({
        fileUrl
      }, 200);

    } catch (error) {
      return formatJSONResponse({
        message: error
      }, 400);
    }
  } else {
      return formatJSONResponse({
        message: 'File was not found'
      }, 400);
  }
};

export const main = middyfy(importProductsFile);
