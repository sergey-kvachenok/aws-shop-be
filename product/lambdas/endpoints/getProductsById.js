import { handleResponse } from '../common/handleResponse';
import { API_ERRORS } from '../../../common/constants';
import { ConnectDB } from '../../postgres/client';
import { isUuidCorrect } from '../common/helpers';

export const handler = async event => {
  console.log(event);
  const { productId } = event.pathParameters || {};

  if (!productId) {
    return handleResponse({ message: API_ERRORS.NO_ID }, 400);
  }

  if (!isUuidCorrect(productId)) {
    return handleResponse({ message: API_ERRORS.INCORRECT_ID }, 400);
  }

  const db = new ConnectDB();

  try {
    const client = await db.connect();

    const { rows } = await client.query(
      `select products.*, stocks.count
       from products
       left join stocks on products.id = stocks.product_id where
       id='${productId}'
       `,
    );

    return handleResponse(rows);
  } catch (error) {
    return handleResponse({ message: error.message }, 500);
  } finally {
    db.disconnect();
  }
};
