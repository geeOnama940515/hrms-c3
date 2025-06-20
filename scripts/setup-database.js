const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "Host=ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech;Database=hrms-bolt;Username=neondb_owner;Password=npg_uKp9a4Wdvegn;SSL Mode=Require;Trust Server Certificate=true",
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up database schema...');
    
    // Create Companies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

    // Create Departments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          head_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created departments table');

    // Create Job Titles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_titles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created job_titles table');

    // Create Employees table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          employee_number VARCHAR(50) UNIQUE NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          middle_name VARCHAR(100),
          birth_date DATE NOT NULL,
          gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
          civil_status VARCHAR(20) NOT NULL CHECK (civil_status IN ('Single', 'Married', 'Divorced', 'Widowed', 'Separated')),
          email VARCHAR(255) UNIQUE NOT NULL,
          phone_number VARCHAR(50) NOT NULL,
          address TEXT NOT NULL,
          sss_number VARCHAR(50),
          philhealth_number VARCHAR(50),
          pagibig_number VARCHAR(50),
          tin VARCHAR(50),
          company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
          job_title_id UUID NOT NULL REFERENCES job_titles(id) ON DELETE RESTRICT,
          date_hired DATE NOT NULL,
          employment_status VARCHAR(20) NOT NULL CHECK (employment_status IN ('Probationary', 'Regular', 'Contractual', 'ProjectBased', 'Resigned', 'Terminated')),
          avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created employees table');

    // Create Users table for authentication
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY', 'DEPARTMENT_HEAD', 'EMPLOYEE')),
          department VARCHAR(255),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
          avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created users table');

    // Create Leave Applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Vacation', 'Sick', 'Emergency', 'Paternity', 'Maternity', 'Bereavement', 'Personal')),
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          total_days INTEGER NOT NULL,
          paid_days INTEGER NOT NULL DEFAULT 0,
          unpaid_days INTEGER NOT NULL DEFAULT 0,
          reason TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved_by_Department', 'Approved', 'Rejected', 'Cancelled')),
          applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          department_head_approved_by UUID REFERENCES employees(id),
          department_head_approved_date TIMESTAMP WITH TIME ZONE,
          department_head_comments TEXT,
          hr_acknowledged_by UUID REFERENCES employees(id),
          hr_acknowledged_date TIMESTAMP WITH TIME ZONE,
          hr_comments TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created leave_applications table');

    // Create Leave Days table for detailed breakdown
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_days (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          leave_application_id UUID NOT NULL REFERENCES leave_applications(id) ON DELETE CASCADE,
          date DATE NOT NULL,
          is_paid BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Created leave_days table');

    // Create Leave Balances table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_balances (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          year INTEGER NOT NULL,
          total_paid_leave INTEGER NOT NULL DEFAULT 5,
          used_paid_leave INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(employee_id, year)
      );
    `);
    console.log('✅ Created leave_balances table');

    // Add foreign key constraint for department head
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM information_schema.table_constraints 
              WHERE constraint_name = 'fk_departments_head_id'
          ) THEN
              ALTER TABLE departments ADD CONSTRAINT fk_departments_head_id 
                  FOREIGN KEY (head_id) REFERENCES employees(id) ON DELETE SET NULL;
          END IF;
      END $$;
    `);
    console.log('✅ Added department head foreign key constraint');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
      CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
      CREATE INDEX IF NOT EXISTS idx_employees_job_title_id ON employees(job_title_id);
      CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
      CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
      CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
      CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
      CREATE INDEX IF NOT EXISTS idx_leave_applications_start_date ON leave_applications(start_date);
      CREATE INDEX IF NOT EXISTS idx_leave_days_leave_application_id ON leave_days(leave_application_id);
      CREATE INDEX IF NOT EXISTS idx_leave_balances_employee_id ON leave_balances(employee_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
    `);
    console.log('✅ Created indexes');

    // Create updated_at trigger function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Created trigger function');

    // Create triggers for updated_at
    await client.query(`
      DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
      DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
      DROP TRIGGER IF EXISTS update_job_titles_updated_at ON job_titles;
      DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      DROP TRIGGER IF EXISTS update_leave_applications_updated_at ON leave_applications;
      DROP TRIGGER IF EXISTS update_leave_balances_updated_at ON leave_balances;
      
      CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_job_titles_updated_at BEFORE UPDATE ON job_titles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_leave_applications_updated_at BEFORE UPDATE ON leave_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON leave_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Created triggers');

    console.log('🎉 Database schema setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('✅ Database setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  });