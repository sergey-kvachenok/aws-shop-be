export const handleResponse = (data = {}, status = 200) => {
  console.log('data', data);
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(data),
  };
};
