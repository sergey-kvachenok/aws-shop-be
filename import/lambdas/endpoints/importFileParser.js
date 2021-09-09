import AWS from 'aws-sdk';
import * as csv from '@fast-csv/parse';
import { handleResponse } from '../common/handleResponse';

export const handler = async event => {
  const { Records = {} } = event;

  try {
    const { s3: eventS3 } = Records[0];
    const { bucket, object } = eventS3 || {};
    console.log('s3', eventS3);

    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const s3Stream = s3.getObject(params).createReadStream();

    const result = await new Promise((resolve, reject) => {
      csv
        .parseStream(s3Stream, { headers: true })
        .on('data', data => {
          console.log('data', data);
        })
        .on('error', error => {
          reject(error);
        })
        .on('end', () => {
          resolve({ message: 'File is successfully parsed' });
        });
    });
    console.log('result', result);

    await s3
      .copyObject({
        Bucket: bucket.name,
        CopySource: `${bucket.name}/${object.key}`,
        Key: object.key.replace('uploaded', 'parsed'),
      })
      .promise();
    console.log('Object had been copied');

    await s3.deleteObject(params).promise();
    console.log('Object had been deleted');

    return handleResponse(null, 204);
  } catch (error) {
    console.log('ERROR', error);
    return handleResponse({ message: error.message }, 500);
  }
};
