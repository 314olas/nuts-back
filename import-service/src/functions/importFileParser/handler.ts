import {S3, SQS} from 'aws-sdk';
import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';

const importFileParser = async (event: S3Event) => {

  const s3 = new S3({region: process.env.REGION})
  const sqs = new SQS({region: process.env.REGION})
  const results = [];

  for (const record of event.Records) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
    }
    const file = s3.getObject(params).createReadStream();

    const messages: Promise<SQS.SendMessageResult>[] = [];

    let promise = new Promise((resolve, reject) => {
      file
      .pipe(csv())
      .on('data', (product) => {
        console.log('data', product);
        messages.push(
          sqs
            .sendMessage({
              MessageBody: JSON.stringify(product),
              QueueUrl: process.env.SQS_URL,
            })
            .promise()
        );
        results.push(product)
      })
      .on('end', () => {
        console.log('csv parse process finished');
        resolve("csv parse process finished");
      })
      .on("error", function () {
        console.log('csv parse process failed');
        reject("csv parse process failed");
      });
    })

    try {
      await promise;
      await Promise.all(messages);

      await s3.copyObject({
        Bucket: process.env.BUCKET_NAME,
        CopySource: `${process.env.BUCKET_NAME}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace(process.env.BUCKET_PREFIX, process.env.BUCKET_IMPORTED_PREFIX)
      }).promise()

      await s3.deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: record.s3.object.key
        }).promise()

      console.log('Results ', results);
    } catch (error) {
      console.log('Get Error: ', error);
    }
  }
};

export const main = importFileParser;
