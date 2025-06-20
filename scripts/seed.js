const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_uKp9a4Wdvegn@ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech/hrms-bolt?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (in reverse order of dependencies)
    await client.query('DELETE FROM leave_days');
    await client.query('DELETE FROM leave_balances');
    await client.query('DELETE FROM leave_applications');
    await client.query('DELETE FROM users');
    await client.query('DELETE FROM employees');
    await client.query('DELETE FROM job_titles');
    await client.query('DELETE FROM departments');
    await client.query('DELETE FROM companies');
    
    console.log('🧹 Cleared existing data');
    
    // Insert Companies
    const companyResult = await client.query(`
      INSERT INTO companies (id, name, description, address, contact_email, contact_phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // Fixed UUID
      'TechCorp Philippines',
      'Leading technology company in the Philippines',
      'BGC, Taguig City, Metro Manila, Philippines',
      'info@techcorp.ph',
      '+63 2 8123 4567'
    ]);
    
    const companyId = companyResult.rows[0].id;
    console.log('✅ Inserted company');
    
    // Insert Departments
    const departments = [
      { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Engineering', description: 'Software development and technical operations' },
      { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Human Resources', description: 'Employee management and organizational development' },
      { id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Marketing', description: 'Brand management and customer acquisition' },
      { id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Finance', description: 'Financial planning and accounting' },
      { id: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', name: 'Operations', description: 'Business operations and process management' }
    ];
    
    for (const dept of departments) {
      await client.query(`
        INSERT INTO departments (id, name, description, company_id)
        VALUES ($1, $2, $3, $4)
      `, [dept.id, dept.name, dept.description, companyId]);
    }
    
    console.log('✅ Inserted departments');
    
    // Insert Job Titles
    const jobTitles = [
      { id: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Software Engineer', description: 'Develops and maintains software applications', departmentId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Senior Developer', description: 'Lead developer with advanced technical skills', departmentId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'UI/UX Designer', description: 'Designs user interfaces and user experiences', departmentId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'HR Specialist', description: 'Manages human resources operations and employee relations', departmentId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Marketing Manager', description: 'Oversees marketing strategies and campaigns', departmentId: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '60eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Financial Analyst', description: 'Analyzes financial data and provides insights', departmentId: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '70eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Operations Manager', description: 'Manages daily business operations and processes', departmentId: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      { id: '80eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', title: 'Content Specialist', description: 'Creates and manages content for marketing purposes', departmentId: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' }
    ];
    
    for (const job of jobTitles) {
      await client.query(`
        INSERT INTO job_titles (id, title, description, department_id)
        VALUES ($1, $2, $3, $4)
      `, [job.id, job.title, job.description, job.departmentId]);
    }
    
    console.log('✅ Inserted job titles');
    
    // Insert Employees
    const employees = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        employeeNumber: 'EMP001',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        middleName: 'Santos',
        birthDate: '1990-05-15',
        gender: 'Male',
        civilStatus: 'Married',
        email: 'juan.delacruz@company.com',
        phoneNumber: '+63 917 123 4567',
        address: '123 Rizal Street, Makati, Metro Manila 1200, Philippines',
        sssNumber: '12-3456789-0',
        philHealthNumber: 'PH123456789',
        pagIbigNumber: 'PG123456789',
        tin: '123-456-789-000',
        departmentId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitleId: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        dateHired: '2023-01-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        employeeNumber: 'EMP002',
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: 'Garcia',
        birthDate: '1992-08-22',
        gender: 'Female',
        civilStatus: 'Single',
        email: 'maria.santos@company.com',
        phoneNumber: '+63 918 234 5678',
        address: '456 Bonifacio Avenue, Quezon City, Metro Manila 1100, Philippines',
        sssNumber: '98-7654321-0',
        philHealthNumber: 'PH987654321',
        pagIbigNumber: 'PG987654321',
        tin: '987-654-321-000',
        departmentId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitleId: '40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        dateHired: '2023-02-01',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        employeeNumber: 'EMP003',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        middleName: 'Mendoza',
        birthDate: '1988-12-10',
        gender: 'Male',
        civilStatus: 'Married',
        email: 'carlos.rodriguez@company.com',
        phoneNumber: '+63 919 345 6789',
        address: '789 EDSA, Pasig, Metro Manila 1600, Philippines',
        sssNumber: '55-5555555-5',
        philHealthNumber: 'PH555555555',
        pagIbigNumber: 'PG555555555',
        tin: '555-555-555-000',
        departmentId: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitleId: '50eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        dateHired: '2022-11-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        employeeNumber: 'EMP004',
        firstName: 'Ana',
        lastName: 'Reyes',
        middleName: 'Cruz',
        birthDate: '1991-03-18',
        gender: 'Female',
        civilStatus: 'Single',
        email: 'ana.reyes@company.com',
        phoneNumber: '+63 920 456 7890',
        address: '321 Ayala Avenue, Makati, Metro Manila 1226, Philippines',
        sssNumber: '11-1111111-1',
        philHealthNumber: 'PH111111111',
        pagIbigNumber: 'PG111111111',
        tin: '111-111-111-000',
        departmentId: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitleId: '60eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        dateHired: '2023-03-01',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        employeeNumber: 'EMP005',
        firstName: 'Miguel',
        lastName: 'Torres',
        middleName: 'Villanueva',
        birthDate: '1989-07-25',
        gender: 'Male',
        civilStatus: 'Divorced',
        email: 'miguel.torres@company.com',
        phoneNumber: '+63 921 567 8901',
        address: '654 Taft Avenue, Manila, Metro Manila 1000, Philippines',
        sssNumber: '22-2222222-2',
        philHealthNumber: 'PH222222222',
        pagIbigNumber: 'PG222222222',
        tin: '222-222-222-000',
        departmentId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        jobTitleId: '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        dateHired: '2022-08-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      }
    ];
    
    for (const emp of employees) {
      await client.query(`
        INSERT INTO employees (
          id, employee_number, first_name, last_name, middle_name, birth_date, gender, civil_status,
          email, phone_number, address, sss_number, philhealth_number, pagibig_number, tin,
          company_id, department_id, job_title_id, date_hired, employment_status, avatar
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      `, [
        emp.id, emp.employeeNumber, emp.firstName, emp.lastName, emp.middleName, emp.birthDate,
        emp.gender, emp.civilStatus, emp.email, emp.phoneNumber, emp.address, emp.sssNumber,
        emp.philHealthNumber, emp.pagIbigNumber, emp.tin, companyId, emp.departmentId,
        emp.jobTitleId, emp.dateHired, emp.employmentStatus, emp.avatar
      ]);
    }
    
    console.log('✅ Inserted employees');
    
    // Insert Users for authentication
    const users = [
      {
        id: 'user-1111-1111-1111-111111111111',
        email: 'hr.manager@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'HR_MANAGER',
        companyId: companyId,
        employeeId: '22222222-2222-2222-2222-222222222222',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-2222-2222-2222-222222222222',
        email: 'hr.supervisor@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Jose',
        lastName: 'Dela Cruz',
        role: 'HR_SUPERVISOR',
        department: 'HR',
        companyId: companyId,
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-3333-3333-3333-333333333333',
        email: 'hr.company@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Carmen',
        lastName: 'Rodriguez',
        role: 'HR_COMPANY',
        department: 'HR',
        companyId: companyId,
        avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-4444-4444-4444-444444444444',
        email: 'dept.head@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Ana',
        lastName: 'Reyes',
        role: 'DEPARTMENT_HEAD',
        department: 'Engineering',
        companyId: companyId,
        employeeId: '44444444-4444-4444-4444-444444444444',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-5555-5555-5555-555555555555',
        email: 'employee@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Juan',
        lastName: 'Mendoza',
        role: 'EMPLOYEE',
        department: 'Engineering',
        companyId: companyId,
        employeeId: '11111111-1111-1111-1111-111111111111',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      }
    ];
    
    for (const user of users) {
      await client.query(`
        INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, company_id, employee_id, avatar)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        user.id, user.email, user.passwordHash, user.firstName, user.lastName,
        user.role, user.department, user.companyId, user.employeeId, user.avatar
      ]);
    }
    
    console.log('✅ Inserted users');
    
    // Insert Leave Balances
    const currentYear = new Date().getFullYear();
    for (const emp of employees) {
      await client.query(`
        INSERT INTO leave_balances (employee_id, year, total_paid_leave, used_paid_leave)
        VALUES ($1, $2, $3, $4)
      `, [emp.id, currentYear, 5, Math.floor(Math.random() * 3)]);
    }
    
    console.log('✅ Inserted leave balances');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('HR Manager: hr.manager@company.com / password123');
    console.log('HR Supervisor: hr.supervisor@company.com / password123');
    console.log('HR Company: hr.company@company.com / password123');
    console.log('Department Head: dept.head@company.com / password123');
    console.log('Employee: employee@company.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });