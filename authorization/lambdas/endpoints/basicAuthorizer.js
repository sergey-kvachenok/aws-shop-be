const generatePolicy = (principalId, resource, effect) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

export const handler = async (event, ctx, callback) => {
  console.log('event', event);

  try {
    const { authorizationToken, type, methodArn } = event;

    if (type !== 'TOKEN') {
      callback('Error: Invalid token');
    }

    let credentialsChunk = authorizationToken.split(' ')[1];

    if (!credentialsChunk || credentialsChunk === 'null') {
      const policy = generatePolicy('user', methodArn, 'Deny');
      callback(null, policy);
    }

    const credentialsBuffer = Buffer.from(credentialsChunk, 'base64');

    const plainCredentials = credentialsBuffer.toString('utf-8');
    const [name, password] = plainCredentials.split(':').map(item => item.trim());

    if (!name || !password) {
      callback('Unauthorized');
    }

    const storedUserPassword = process.env[name];
    const isPasswordCorrect = storedUserPassword && storedUserPassword === password;
    console.log('name', name, typeof name);
    console.log('password', password, typeof password);
    console.log('storedUserPassword', storedUserPassword, typeof storedUserPassword);

    if (!storedUserPassword) {
      callback('Unauthorized');
    }

    const effect = isPasswordCorrect ? 'Allow' : 'Deny';
    const policy = generatePolicy('user', methodArn, effect);

    callback(null, policy);
  } catch (error) {
    console.log(error, error.message);
  }
};
