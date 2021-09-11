const API_ERRORS = {
  NO_ID: 'Id from the path was not provided',
  NO_ITEM_IN_DB: 'There is no such item in the database',
  LACK_OF_PARAMS: 'Product data is invalid',
  DB_CONNECTION_ERROR: 'DB connection error',
  SOMETHING_WRONG: 'Something went wrong',
  NO_TABLE_NAME: "Table name wasn't provided",
  INCORRECT_ID: 'Provided id is not correct',
  INCORRECT_PARAMS: 'One or several parameters have incorrect type',
  INVALID_QUERY_PARAMETRS: 'Query parameters are invalid',
  INCORRECT_FILE_FORMAT: 'Incorrect file format',
};

const REGEXP = {
  uuid: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
};

module.exports = { API_ERRORS, REGEXP };
