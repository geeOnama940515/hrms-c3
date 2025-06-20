const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_uKp9a4Wdvegn@ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech/hrms-bolt?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = async (text: string, params?: any[]) => {
  console.log('📡 DB: Executing query:', text.substring(0, 100) + '...');
  console.log('📡 DB: Query params:', params);
  
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    console.log('✅ DB: Query successful, rows returned:', result.rows.length);
    return result;
  } catch (error) {
    console.error('❌ DB: Query failed:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export default pool;