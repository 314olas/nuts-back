import { Pool } from 'pg';

const config = {
  user: process.env.DB_USER_NAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

let pool;

export const poolQuery = async (query: string) => {
  if (!pool) {
    pool = new Pool(config);
  }
  const client = await pool.connect();

  try {
    const result = await client.query(query);
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
};
