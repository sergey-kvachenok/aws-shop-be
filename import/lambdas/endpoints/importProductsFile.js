import AWS from 'aws-sdk';
import { handleResponse } from '../common/handleResponse';
import { API_ERRORS } from '../../../common/constants';

export const handler = async event => {
  console.log(process.env);
  const { name } = event.queryStringParameters;

  if (!name) {
    return handleResponse({ message: API_ERRORS.INVALID_QUERY_PARAMETRS });
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
        console.log('s3', s3);
        if (error) {
          console.log('internalError', error);
          reject(error);
        }
        console.log('url', url);
        resolve(url);
      });
    });
    console.log('here', handleResponse(url));
    return handleResponse(url, 200);
  } catch (error) {
    console.log('ERROR', error);
    return handleResponse({ message: error.message });
  }
};
