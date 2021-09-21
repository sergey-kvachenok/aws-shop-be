import { handleResponse } from '../common/handleResponse';
import { ConnectDB } from '../../postgres/client';

export const handler = async event => {
  console.log(event);
  const db = new ConnectDB();
  try {
    const client = await db.connect();

    const { rows } = await client.query(
      `select products.*, stocks.count from products left join stocks on products.id = stocks.product_id`,
    );

    return handleResponse(rows);
  } catch (error) {
    return handleResponse({ message: error.message }, 500);
  } finally {
    db.disconnect();
  }
};
