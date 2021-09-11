export const handleResponse = (data, status = 200) => {
  return {
    headers: {
      'Content-Type': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: data,
  };
};
