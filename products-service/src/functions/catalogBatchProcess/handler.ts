import {SNS} from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { Product } from 'src/models/Products';

const catalogBatchProcess = async (event: SQSEvent) => {
  const products = event.Records.map(({body}) => body)
  const sns = new SNS({apiVersion: '2010-03-31'});

  if (!products && !products.length) {
    console.log('Nothing to do');
    return;
  }

  try {
    for (const product of products) {

      const newProduct = {...product, price: +product.price}
      const response = await sns.publish({
          Subject: 'create product',
          Message: product,
          TopicArn: process.env.SNS_TOPIC
        }).promise();
      console.log('response is ->', response);
    }
  } catch (error) {
    console.log('error -> ',error);
  }
};

export const main = catalogBatchProcess;
