import { handleResponse } from '../common/handleResponse';
import data from '../data.json';

export const handler = async event => handleResponse(data);
