
import { handler as getProductsList } from './getProductsList';
import { isApiGatewayResponse } from '../../test_utils/validate';
import generateEvent from '../../test_utils/generateEvent';
import data from '../data.json'

describe('getProductsList', () => {
    test('return the list of products', async () => {
         const event = generateEvent({
            body: {
               data
            },
        });

        const res = await getProductsList(event);

        expect(res).toBeDefined();
        expect(isApiGatewayResponse(res)).toBe(true);
        expect(res.statusCode).toBe(200)
    });
});