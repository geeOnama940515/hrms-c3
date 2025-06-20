import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "Host=ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech;Database=hrms-bolt;Username=neondb_owner;Password=npg_uKp9a4Wdvegn;SSL Mode=Require;Trust Server Certificate=true",
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