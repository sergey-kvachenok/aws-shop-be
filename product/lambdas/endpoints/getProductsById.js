import { handleResponse } from '../common/handleResponse'
import API_ERRORS from '../../../common/constants'
import data  from '../data.json'

export const handler = async (event) => {
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
