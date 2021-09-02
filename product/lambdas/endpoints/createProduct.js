import { handleResponse } from '../common/handleResponse';
import { ConnectDB, dbOptions } from '../../postgres/client';
import { API_ERRORS } from '../../../common/constants';

export const handler = async event => {
  console.log(event);
  const db = new ConnectDB(dbOptions);
  const client = await db.connect();

  try {
    const { title, description, price, image_id, count } = JSON.parse(event.body);
    const notAllParamsProvided = !title || !description || !price || !image_id || !count;

    if (notAllParamsProvided) {
      return handleResponse({ message: API_ERRORS.LACK_OF_PARAMS }, 400);
    }

    const hasCorrectTypes =
      [title, description, image_id].every(param => typeof param === 'string') &&
      [price, count].every(param => typeof param === 'number');

    if (!hasCorrectTypes) {
      return handleResponse({ message: API_ERRORS.INCORRECT_PARAMS }, 400);
    }

    await client.query('BEGIN');

    const insertProductsText =
      'INSERT INTO products(title, description, price, image_id) VALUES($1, $2, $3, $4) RETURNING id';
    const productsResponse = await client.query(insertProductsText, [title, description, price, image_id]);
    const { id: productId } = productsResponse.rows[0];

    const insertStocksText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
    await client.query(insertStocksText, [productId, count]);

    await client.query('COMMIT');

    const dataToResponse = {
      title,
      description,
      price,
      image_id,
      count,
      id: productId,
    };

    return handleResponse(dataToResponse);
  } catch (error) {
    await client.query('ROLLBACK');
    return handleResponse({ message: API_ERRORS.SOMETHING_WRONG }, 500);
  } finally {
    await db.disconnect();
  }
};
