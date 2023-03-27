import {SNS} from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';

const catalogBatchProcess = async (event: SQSEvent) => {
  const products = event.Records.map(({body}) => body)
  const sns = new SNS({apiVersion: '2010-03-31'});

  if (!products && !products.length) {
    console.log('Nothing to do');
    return;
  }

  try {
    for (const product of products) {

      const response = await sns.publish({
          Subject: 'create product',
          Message: JSON.stringify(product),
          TopicArn: process.env.SNS_TOPIC
        }).promise();
      console.log('response is ->', response);
    }
  } catch (error) {
    console.log('error -> ',error);
  }
};

export const main = catalogBatchProcess;
