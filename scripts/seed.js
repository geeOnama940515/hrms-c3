const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "Host=ep-rough-brook-a15a4fjt-pooler.ap-southeast-1.aws.neon.tech;Database=hrms-bolt;Username=neondb_owner;Password=npg_uKp9a4Wdvegn;SSL Mode=Require;Trust Server Certificate=true",
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
      'company-1',
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
      { id: 'dept-1', name: 'Engineering', description: 'Software development and technical operations' },
      { id: 'dept-2', name: 'Human Resources', description: 'Employee management and organizational development' },
      { id: 'dept-3', name: 'Marketing', description: 'Brand management and customer acquisition' },
      { id: 'dept-4', name: 'Finance', description: 'Financial planning and accounting' },
      { id: 'dept-5', name: 'Operations', description: 'Business operations and process management' }
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
      { id: 'job-1', title: 'Software Engineer', description: 'Develops and maintains software applications', departmentId: 'dept-1' },
      { id: 'job-2', title: 'Senior Developer', description: 'Lead developer with advanced technical skills', departmentId: 'dept-1' },
      { id: 'job-3', title: 'UI/UX Designer', description: 'Designs user interfaces and user experiences', departmentId: 'dept-1' },
      { id: 'job-4', title: 'HR Specialist', description: 'Manages human resources operations and employee relations', departmentId: 'dept-2' },
      { id: 'job-5', title: 'Marketing Manager', description: 'Oversees marketing strategies and campaigns', departmentId: 'dept-3' },
      { id: 'job-6', title: 'Financial Analyst', description: 'Analyzes financial data and provides insights', departmentId: 'dept-4' },
      { id: 'job-7', title: 'Operations Manager', description: 'Manages daily business operations and processes', departmentId: 'dept-5' },
      { id: 'job-8', title: 'Content Specialist', description: 'Creates and manages content for marketing purposes', departmentId: 'dept-3' }
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
        id: 'emp-1',
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
        departmentId: 'dept-1',
        jobTitleId: 'job-1',
        dateHired: '2023-01-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-2',
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
        departmentId: 'dept-2',
        jobTitleId: 'job-4',
        dateHired: '2023-02-01',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-3',
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
        departmentId: 'dept-3',
        jobTitleId: 'job-5',
        dateHired: '2022-11-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-4',
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
        departmentId: 'dept-4',
        jobTitleId: 'job-6',
        dateHired: '2023-03-01',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-5',
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
        departmentId: 'dept-1',
        jobTitleId: 'job-2',
        dateHired: '2022-08-15',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-6',
        employeeNumber: 'EMP006',
        firstName: 'Isabella',
        lastName: 'Fernandez',
        middleName: 'Lopez',
        birthDate: '1993-11-08',
        gender: 'Female',
        civilStatus: 'Single',
        email: 'isabella.fernandez@company.com',
        phoneNumber: '+63 922 678 9012',
        address: '987 Ortigas Avenue, Pasig, Metro Manila 1605, Philippines',
        sssNumber: '33-3333333-3',
        philHealthNumber: 'PH333333333',
        pagIbigNumber: 'PG333333333',
        tin: '333-333-333-000',
        departmentId: 'dept-1',
        jobTitleId: 'job-3',
        dateHired: '2023-06-01',
        employmentStatus: 'Probationary',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-7',
        employeeNumber: 'EMP007',
        firstName: 'Roberto',
        lastName: 'Gonzales',
        middleName: 'Ramos',
        birthDate: '1987-04-12',
        gender: 'Male',
        civilStatus: 'Married',
        email: 'roberto.gonzales@company.com',
        phoneNumber: '+63 923 789 0123',
        address: '246 Commonwealth Avenue, Quezon City, Metro Manila 1121, Philippines',
        sssNumber: '44-4444444-4',
        philHealthNumber: 'PH444444444',
        pagIbigNumber: 'PG444444444',
        tin: '444-444-444-000',
        departmentId: 'dept-5',
        jobTitleId: 'job-7',
        dateHired: '2021-09-20',
        employmentStatus: 'Regular',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
      },
      {
        id: 'emp-8',
        employeeNumber: 'EMP008',
        firstName: 'Carmen',
        lastName: 'Valdez',
        middleName: 'Morales',
        birthDate: '1994-09-30',
        gender: 'Female',
        civilStatus: 'Single',
        email: 'carmen.valdez@company.com',
        phoneNumber: '+63 924 890 1234',
        address: '135 Shaw Boulevard, Mandaluyong, Metro Manila 1552, Philippines',
        sssNumber: '66-6666666-6',
        philHealthNumber: 'PH666666666',
        pagIbigNumber: 'PG666666666',
        tin: '666-666-666-000',
        departmentId: 'dept-3',
        jobTitleId: 'job-8',
        dateHired: '2023-04-15',
        employmentStatus: 'Contractual',
        avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
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
        id: 'user-1',
        email: 'hr.manager@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'HR_MANAGER',
        companyId: companyId,
        employeeId: 'emp-2',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-2',
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
        id: 'user-3',
        email: 'hr.company@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Carmen',
        lastName: 'Rodriguez',
        role: 'HR_COMPANY',
        department: 'HR',
        companyId: companyId,
        employeeId: 'emp-8',
        avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-4',
        email: 'dept.head@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Ana',
        lastName: 'Reyes',
        role: 'DEPARTMENT_HEAD',
        department: 'Engineering',
        companyId: companyId,
        employeeId: 'emp-4',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
      },
      {
        id: 'user-5',
        email: 'employee@company.com',
        passwordHash: '$2b$10$rQZ9QmjotWNdGhzXzXzXzOzXzXzXzXzXzXzXzXzXzXzXzXzXzXzXzX', // password123
        firstName: 'Juan',
        lastName: 'Mendoza',
        role: 'EMPLOYEE',
        department: 'Engineering',
        companyId: companyId,
        employeeId: 'emp-1',
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
    
    // Insert sample Leave Applications
    const leaveApplications = [
      {
        id: 'leave-1',
        employeeId: 'emp-1',
        leaveType: 'Vacation',
        startDate: '2024-02-15',
        endDate: '2024-02-19',
        totalDays: 5,
        paidDays: 3,
        unpaidDays: 2,
        reason: 'Family vacation to Boracay - need some unpaid days to extend the trip',
        status: 'Approved',
        departmentHeadApprovedBy: 'emp-4',
        departmentHeadApprovedDate: '2024-02-02T10:30:00Z',
        departmentHeadComments: 'Approved. Enjoy your vacation!',
        hrAcknowledgedBy: 'emp-2',
        hrAcknowledgedDate: '2024-02-02T14:15:00Z',
        hrComments: 'Leave acknowledged and processed.',
        leaveDays: [
          { date: '2024-02-15', isPaid: true },
          { date: '2024-02-16', isPaid: true },
          { date: '2024-02-17', isPaid: false },
          { date: '2024-02-18', isPaid: false },
          { date: '2024-02-19', isPaid: true }
        ]
      },
      {
        id: 'leave-2',
        employeeId: 'emp-6',
        leaveType: 'Sick',
        startDate: '2024-01-25',
        endDate: '2024-01-26',
        totalDays: 2,
        paidDays: 2,
        unpaidDays: 0,
        reason: 'Flu symptoms and fever',
        status: 'Approved_by_Department',
        departmentHeadApprovedBy: 'emp-4',
        departmentHeadApprovedDate: '2024-01-24T11:00:00Z',
        departmentHeadComments: 'Get well soon!',
        leaveDays: [
          { date: '2024-01-25', isPaid: true },
          { date: '2024-01-26', isPaid: true }
        ]
      },
      {
        id: 'leave-3',
        employeeId: 'emp-3',
        leaveType: 'Personal',
        startDate: '2024-03-01',
        endDate: '2024-03-03',
        totalDays: 3,
        paidDays: 1,
        unpaidDays: 2,
        reason: 'Personal matters to attend to - only need one paid day',
        status: 'Pending',
        leaveDays: [
          { date: '2024-03-01', isPaid: true },
          { date: '2024-03-02', isPaid: false },
          { date: '2024-03-03', isPaid: false }
        ]
      }
    ];
    
    for (const leave of leaveApplications) {
      await client.query(`
        INSERT INTO leave_applications (
          id, employee_id, leave_type, start_date, end_date, total_days, paid_days, unpaid_days,
          reason, status, department_head_approved_by, department_head_approved_date,
          department_head_comments, hr_acknowledged_by, hr_acknowledged_date, hr_comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        leave.id, leave.employeeId, leave.leaveType, leave.startDate, leave.endDate,
        leave.totalDays, leave.paidDays, leave.unpaidDays, leave.reason, leave.status,
        leave.departmentHeadApprovedBy, leave.departmentHeadApprovedDate,
        leave.departmentHeadComments, leave.hrAcknowledgedBy, leave.hrAcknowledgedDate,
        leave.hrComments
      ]);
      
      // Insert leave days
      for (const day of leave.leaveDays) {
        await client.query(`
          INSERT INTO leave_days (leave_application_id, date, is_paid)
          VALUES ($1, $2, $3)
        `, [leave.id, day.date, day.isPaid]);
      }
    }
    
    console.log('✅ Inserted leave applications and leave days');
    
    // Update department heads
    await client.query(`
      UPDATE departments SET head_id = $1 WHERE id = $2
    `, ['emp-4', 'dept-4']); // Ana Reyes as Finance head
    
    await client.query(`
      UPDATE departments SET head_id = $1 WHERE id = $2
    `, ['emp-7', 'dept-5']); // Roberto as Operations head
    
    console.log('✅ Updated department heads');
    
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