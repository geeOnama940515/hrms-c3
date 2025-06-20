const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "Host=ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech;Database=hrms-bolt;Username=neondb_owner;Password=npg_uKp9a4Wdvegn;SSL Mode=Require;Trust Server Certificate=true",
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  const client = await pool.connect();
  
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Existing tables:');
    if (tablesResult.rows.length === 0) {
      console.log('❌ No tables found in public schema');
      console.log('🔧 Creating tables now...');
      
      // Create companies table first
      await client.query(`
        CREATE TABLE companies (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            address TEXT,
            contact_email VARCHAR(255),
            contact_phone VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      console.log('✅ Created companies table');
      
      // Insert sample company
      await client.query(`
        INSERT INTO companies (id, name, description, address, contact_email, contact_phone)
        VALUES ('company-1', 'TechCorp Philippines', 'Leading technology company in the Philippines', 'BGC, Taguig City, Metro Manila, Philippines', 'info@techcorp.ph', '+63 2 8123 4567');
      `);
      console.log('✅ Inserted sample company');
      
      // Verify table creation
      const verifyResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      console.log('\n📋 Tables after creation:');
      verifyResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log('\n🎉 Database test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database test failed:', error);
    process.exit(1);
  });