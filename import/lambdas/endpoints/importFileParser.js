import AWS from 'aws-sdk';
import * as csv from '@fast-csv/parse';
import { handleResponse } from '../common/handleResponse';

const sendMessageToSQS = async (sqs, messageBody) => {
  await sqs.sendMessage(
    {
      QueueUrl: process.env.SQS_URL,
      MessageBody: messageBody,
    },
    (error, data) => {
      if (error) {
        console.log('SQS error', error);
        throw Error(error);
      }
      console.log(`Send message: ${data}`);
    },
  );
};

export const handler = async event => {
  const { Records = {} } = event;

  try {
    const { s3: eventS3 } = Records[0];
    const { bucket, object } = eventS3 || {};

    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS({ region: 'eu-west-1' });
    const s3Stream = s3.getObject(params).createReadStream();

    const result = await new Promise((resolve, reject) => {
      csv
        .parseStream(s3Stream, { headers: true })
        .on('data', data => {
          sendMessageToSQS(sqs, JSON.stringify(data));
        })
        .on('error', error => {
          reject(error);
        })
        .on('end', async rowCount => {
          console.log(`Was parsed ${rowCount} lines`);
          await sendMessageToSQS(
            sqs,
            JSON.stringify({
              status: 'File parsed',
            }),
          );

          await s3
            .copyObject({
              Bucket: bucket.name,
              CopySource: `${bucket.name}/${object.key}`,
              Key: object.key.replace('uploaded', 'parsed'),
            })
            .promise();

          await s3.deleteObject(params).promise();

          resolve({ message: 'File is successfully parsed' });
        });
    });
    console.log('result', result);

    return handleResponse(null, 204);
  } catch (error) {
    console.log('error', error);
    return handleResponse({ message: error.message }, 500);
  }
};
