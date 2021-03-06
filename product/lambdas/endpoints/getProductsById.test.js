import { handler as getProductsById } from './getProductsById';
import generateEvent from '../../test_utils/generateEvent';
import API_ERRORS from '../../../common/constants';
import data from '../data.json';

describe('getProductsById', () => {
  test('returns the correct product from the list', async () => {
    const dataItem = data[0];

    const event = generateEvent({
      pathParametersObject: {
        productId: dataItem.id,
      },
    });

    const res = await getProductsById(event);
    const receivedData = JSON.parse(res.body);

    expect(res).toBeDefined();
    expect(receivedData).toEqual(dataItem);
    expect(res.statusCode).toBe(200);
  });

  test('returns an error if no productId proveded', async () => {
    const event = generateEvent({
      pathParametersObject: {
        productId: '',
      },
    });

    const res = await getProductsById(event);
    const { message } = JSON.parse(res.body) || {};

    expect(res.statusCode).toBe(400);
    expect(message).toEqual(API_ERRORS.NO_ID);
  });

  test('returns an error if no product was founded', async () => {
    const fakeId = '123';
    const event = generateEvent({
      pathParametersObject: {
        productId: fakeId,
      },
    });

    const res = await getProductsById(event);
    const { message } = JSON.parse(res.body) || {};

    expect(res.statusCode).toBe(400);
    expect(message).toEqual(API_ERRORS.NO_ITEM_IN_DB);
  });
});
