import AWS from 'aws-sdk';
import { Client } from 'pg';
import { API_ERRORS } from '../../../common/constants';
import { handleResponse } from '../common/handleResponse';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  user: PG_USERNAME,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const handler = async event => {
  const client = new Client(dbOptions);
  client.connect();
  let isFileParsed = false;

  try {
    const messages = event.Records.map(({ body }) => body);

    for (let message of messages) {
      const { title, description, price, image_id, count, status } = JSON.parse(message);

      if (status) {
        isFileParsed = true;
        break;
      }

      const hasAllParams = !!(title && description && price && image_id && count);

      if (!hasAllParams) {
        throw Error(API_ERRORS.INVALID_QUERY_PARAMETRS);
      }

      await client.query('BEGIN');
      const insertProductsText =
        'INSERT INTO products(title, description, price, image_id) VALUES($1, $2, $3, $4) RETURNING id';
      const productsResponse = await client.query(insertProductsText, [title, description, price, image_id]);
      console.log('productsResponse', productsResponse);
      const { id: productId } = productsResponse.rows[0];
      const insertStocksText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
      await client.query(insertStocksText, [productId, count]);
      await client.query('COMMIT');
    }

    const sns = new AWS.SNS({ region: 'eu-west-1' });

    const params = {
      Subject: 'End of file parsing',
      Message: isFileParsed ? 'File has been parsed' : 'Parsing is in progress',
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        status: {
          DataType: 'String',
          StringValue: isFileParsed ? 'Done' : 'In Progress',
        },
      },
    };

    const result = await sns.publish(params).promise();
    return handleResponse(result);
  } catch (error) {
    console.log('error', error.message);
    if (error.message !== API_ERRORS.INVALID_QUERY_PARAMETRS) {
      await client.query('ROLLBACK');
      return handleResponse({ message: API_ERRORS.SOMETHING_WRONG }, 500);
    }

    return handleResponse({ message: error.message }, 400);
  } finally {
    await client.end();
  }
};
