export const handleResponse = (data, status = 200) => {
  return {
    headers: {
      'Content-Type': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: status,
    body: data,
  };
};
