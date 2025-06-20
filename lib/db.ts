const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_uKp9a4Wdvegn@ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech/hrms-bolt?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export default pool;