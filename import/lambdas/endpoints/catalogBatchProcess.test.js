import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { handler as catalogBatchProcess } from './catalogBatchProcess';
import { API_ERRORS } from '../../../common/constants';

const testRecord = {
  title: 'Test title',
  description: 'Test description',
  count: 1,
  image_id: '007',
  price: 10,
};

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(() => ({
      rows: [{ ...testRecord, id: '001' }],
    })),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe('catalogBatchProcess', () => {
  process.env = {
    SNS_ARN: 'test-sns-arn',
    PG_USERNAME: 'user_name',
    PG_HOST: 'host',
    PG_DATABASE: 'data_base',
    PG_PASSWORD: 'password',
    PG_PORT: '5432',
  };

  const getEvent = record => ({
    Records: [
      {
        body: JSON.stringify(record),
      },
    ],
  });

  AWSMock.setSDKInstance(AWS);

  beforeEach(() => {
    AWSMock.mock('SNS', 'publish', Promise.resolve('The data has been sended'));
  });

  afterEach(() => {
    jest.clearAllMocks();
    AWSMock.restore();
  });

  test('publish the message', async () => {
    const result = await catalogBatchProcess(getEvent(testRecord));
    expect(result.body).toBe('The data has been sended');
  });

  test('throws an error if not all params are correct', async () => {
    const record = { ...testRecord };
    delete record.count;

    const result = await catalogBatchProcess(getEvent(record));
    const { body, statusCode } = result;

    expect(statusCode).toBe(400);
    expect(body.message).toEqual(API_ERRORS.INVALID_QUERY_PARAMETRS);
  });

  test('returns the error in case of any unhandled error', async () => {
    AWSMock.remock('SNS', 'publish', Promise.reject(new Error(API_ERRORS.SOMETHING_WRONG)));
    const result = await catalogBatchProcess(getEvent(testRecord));
    const { body, statusCode } = result;

    expect(statusCode).toBe(500);
    expect(body.message).toEqual(API_ERRORS.SOMETHING_WRONG);
  });
});
