const handleResponse = require('../common/handleResponse')
const data = require('../data.json')

exports.handler = async (event) => {
  console.log(event)
  return handleResponse(data)
  };

