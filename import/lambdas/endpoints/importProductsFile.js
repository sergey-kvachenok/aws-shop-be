import AWS from 'aws-sdk';
import { handleResponse } from '../common/handleResponse';
import { API_ERRORS } from '../../../common/constants';

export const handler = async event => {
  console.log(process.env);
  console.log('event', event);

  const { name } = event.queryStringParameters;

  if (!name) {
    return handleResponse({ message: API_ERRORS.INVALID_QUERY_PARAMETRS }, 400);
  }

  const isCsv = name.split('.')[1]?.toLowerCase() === 'csv';

  if (!isCsv) {
    return handleResponse({ message: API_ERRORS.INCORRECT_FILE_FORMAT }, 400);
  }

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const url = await new Promise((resolve, reject) => {
      return s3.getSignedUrl('putObject', params, (error, url) => {
        if (error) {
          reject(error);
        }
        resolve(url);
      });
    });

    console.log('url', url);

    return handleResponse(url, 200);
  } catch (error) {
    return handleResponse({ message: error.message }, 500);
  }
};
