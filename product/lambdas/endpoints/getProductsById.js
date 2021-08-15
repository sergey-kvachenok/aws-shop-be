const handleResponse = require('../common/handleResponse')
const API_ERRORS = require('../../../common/constants')
const data = require('../data.json')

exports.handler  = async (event) => {
  console.log('event: ', event)
  const { productId } = event.pathParameters || {}

  if (!productId) {
    return handleResponse({message: API_ERRORS.NO_ID}, 400)
  }

  const product = data.find( ({ id }) => id === productId)

if (!product) {
    return handleResponse({message: API_ERRORS.NO_ITEM_IN_DB}, 400)
  }

  return handleResponse({...product}, 200)

  };