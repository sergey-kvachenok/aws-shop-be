
const getProductsList = require('./getProductsList');
const { isApiGatewayResponse } = require('../../test_utils/validate');
const generateEvent = require('../../test_utils/generateEvent');
const data = require('../data.json')

console.log(getProductsList)

describe('getProductsList', () => {
    test('return the list of products', async () => {
         const event = generateEvent({
            body: {
               data
            },
        });

        const res = await getProductsList.handler(event);

        expect(res).toBeDefined();
        expect(isApiGatewayResponse(res)).toBe(true);
        expect(res.statusCode).toBe(200)
    });
});