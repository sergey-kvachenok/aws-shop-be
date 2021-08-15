const handleResponse = require('../common/handleResponse')
const data = require('../data.json')

exports.handler  = async (event) => {
  return handleResponse(data)
  };
