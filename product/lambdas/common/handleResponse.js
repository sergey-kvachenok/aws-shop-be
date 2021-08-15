const handleResponse = (data = {}, status=200) => ({
  headers: {
           'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
  },
  statusCode: status,
  body: JSON.stringify(data)
})

module.exports = handleResponse