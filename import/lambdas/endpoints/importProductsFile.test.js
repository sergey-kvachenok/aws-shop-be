import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { handler as importProductsFile } from './importProductsFile';
import { API_ERRORS } from '../../../common/constants';

describe('importProductsFile', () => {
  const mockedUrl = 'https://test-bucket.s3.eu-west-1.amazonaws.com/uploaded/test.cvs';
  process.env = { BUCKET_NAME: 'test-bucket' };

  const event = {
    queryStringParameters: {
      name: 'test.csv',
    },
  };

  AWSMock.setSDKInstance(AWS);

  beforeEach(() => {
    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
      callback(null, mockedUrl);
    });
  });

  afterEach(() => {
    AWSMock.restore();
  });

  test('returns the signedUrl', async () => {
    const result = await importProductsFile(event);

    const { body, statusCode } = result;

    expect(body).toEqual(mockedUrl);
    expect(statusCode).toBe(200);
  });

  test('returns the error if there are no name param', async () => {
    const event = {
      queryStringParameters: {},
    };

    const result = await importProductsFile(event);
    const { body, statusCode } = result;

    expect(statusCode).toBe(400);
    expect(body.message).toEqual(API_ERRORS.INVALID_QUERY_PARAMETRS);
  });

  test('returns the error in case of any unhandled error', async () => {
    AWSMock.remock('S3', 'getSignedUrl', (action, params, callback) => {
      callback(new Error(API_ERRORS.SOMETHING_WRONG));
    });

    const result = await importProductsFile(event);
    const { body, statusCode } = result;

    expect(statusCode).toBe(500);
    expect(body.message).toEqual(API_ERRORS.SOMETHING_WRONG);
  });

  test('returns an error if file format is not csv', async () => {
    const event = {
      queryStringParameters: {
        name: 'image.png',
      },
    };

    const result = await importProductsFile(event);
    const { body, statusCode } = result;

    expect(statusCode).toBe(400);
    expect(body.message).toEqual(API_ERRORS.INCORRECT_FILE_FORMAT);
  });
});
