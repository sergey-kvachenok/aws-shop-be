import { Client } from 'pg';
import { handleResponse } from '../lambdas/common/handleResponse';
import { API_ERRORS } from '../../common/constants';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const dbOptions = {
  user: PG_USERNAME,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export class ConnectDB {
  constructor() {
    this.client = new Client(dbOptions);
  }

  async connect() {
    await this.client.connect();
    return this.client;
  }

  async disconnect() {
    await this.client.end();
  }

  async createTable(tableName, config) {
    await this.client.query(`
  create table if not exist ${tableName} (
    ${config}
  )`);
  }

  async insert(tableName, dataToStorDB = {}) {
    const keys = Object.keys(dataToStorDB);
    const values = Object.values(dataToStorDB);
    const fieldsTemplate = keys.join(', ');

    const valuesTeplate = Array.from(new Array(values.length))
      .map((item, index) => `$${index + 1}`)
      .join(', ');

    const result = await this.client.query(
      `
    insert into ${tableName} (${fieldsTemplate}) values (${valuesTeplate})
   RETURNING id, ${fieldsTemplate}`,
      values,
    );

    return result;
  }

  async getList(tableName) {
    const { rows } = await this.client.query(`select * from ${tableName}`);
    return rows;
  }
}
