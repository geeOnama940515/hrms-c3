import { query } from './db';
import { Employee, Department, JobTitle, Company, EmploymentStatus, Gender, CivilStatus } from '@/types';

// Helper function to convert database row to Employee object
const mapRowToEmployee = (row: any): Employee => ({
  id: row.id,
  employeeNumber: row.employee_number,
  firstName: row.first_name,
  lastName: row.last_name,
  middleName: row.middle_name,
  birthDate: row.birth_date,
  gender: row.gender as Gender,
  civilStatus: row.civil_status as CivilStatus,
  email: row.email,
  phoneNumber: row.phone_number,
  address: row.address,
  sssNumber: row.sss_number,
  philHealthNumber: row.philhealth_number,
  pagIbigNumber: row.pagibig_number,
  tin: row.tin,
  companyId: row.company_id,
  departmentId: row.department_id,
  jobTitleId: row.job_title_id,
  dateHired: row.date_hired,
  employmentStatus: row.employment_status as EmploymentStatus,
  avatar: row.avatar,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  // Add display names if joined
  department: row.department_name,
  jobTitle: row.job_title,
  company: row.company_name
});

const mapRowToDepartment = (row: any): Department => ({
  id: row.id,
  name: row.name,
  description: row.description,
  companyId: row.company_id,
  headId: row.head_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapRowToJobTitle = (row: any): JobTitle => ({
  id: row.id,
  title: row.title,
  description: row.description,
  departmentId: row.department_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const mapRowToCompany = (row: any): Company => ({
  id: row.id,
  name: row.name,
  description: row.description,
  address: row.address,
  contactEmail: row.contact_email,
  contactPhone: row.contact_phone,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// Company CRUD operations
export const getCompanies = async (): Promise<Company[]> => {
  const result = await query('SELECT * FROM companies ORDER BY name');
  return result.rows.map(mapRowToCompany);
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  const result = await query('SELECT * FROM companies WHERE id = $1', [id]);
  return result.rows.length > 0 ? mapRowToCompany(result.rows[0]) : null;
};

// Employee CRUD operations
export const getEmployees = async (): Promise<Employee[]> => {
  const result = await query(`
    SELECT 
      e.*,
      d.name as department_name,
      jt.title as job_title,
      c.name as company_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN job_titles jt ON e.job_title_id = jt.id
    LEFT JOIN companies c ON e.company_id = c.id
    ORDER BY e.first_name, e.last_name
  `);
  return result.rows.map(mapRowToEmployee);
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const result = await query(`
    SELECT 
      e.*,
      d.name as department_name,
      jt.title as job_title,
      c.name as company_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN job_titles jt ON e.job_title_id = jt.id
    LEFT JOIN companies c ON e.company_id = c.id
    WHERE e.id = $1
  `, [id]);
  return result.rows.length > 0 ? mapRowToEmployee(result.rows[0]) : null;
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
  const result = await query(`
    INSERT INTO employees (
      employee_number, first_name, last_name, middle_name, birth_date, gender, civil_status,
      email, phone_number, address, sss_number, philhealth_number, pagibig_number, tin,
      company_id, department_id, job_title_id, date_hired, employment_status, avatar
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING *
  `, [
    employee.employeeNumber, employee.firstName, employee.lastName, employee.middleName,
    employee.birthDate, employee.gender, employee.civilStatus, employee.email,
    employee.phoneNumber, employee.address, employee.sssNumber, employee.philHealthNumber,
    employee.pagIbigNumber, employee.tin, employee.companyId, employee.departmentId,
    employee.jobTitleId, employee.dateHired, employee.employmentStatus, employee.avatar
  ]);
  
  return await getEmployeeById(result.rows[0].id) as Employee;
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
      // Convert camelCase to snake_case for database columns
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id); // Add id as the last parameter
  
  await query(`
    UPDATE employees 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramCount}
  `, values);

  return await getEmployeeById(id) as Employee;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await query('DELETE FROM employees WHERE id = $1', [id]);
};

// Department CRUD operations
export const getDepartments = async (): Promise<Department[]> => {
  const result = await query('SELECT * FROM departments ORDER BY name');
  return result.rows.map(mapRowToDepartment);
};

export const getDepartmentById = async (id: string): Promise<Department | null> => {
  const result = await query('SELECT * FROM departments WHERE id = $1', [id]);
  return result.rows.length > 0 ? mapRowToDepartment(result.rows[0]) : null;
};

export const createDepartment = async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
  const result = await query(`
    INSERT INTO departments (name, description, company_id, head_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [department.name, department.description, department.companyId, department.headId]);
  
  return mapRowToDepartment(result.rows[0]);
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id);
  
  await query(`
    UPDATE departments 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramCount}
  `, values);

  return await getDepartmentById(id) as Department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await query('DELETE FROM departments WHERE id = $1', [id]);
};

// Job Title CRUD operations
export const getJobTitles = async (departmentId?: string): Promise<JobTitle[]> => {
  let queryText = 'SELECT * FROM job_titles';
  const params = [];
  
  if (departmentId) {
    queryText += ' WHERE department_id = $1';
    params.push(departmentId);
  }
  
  queryText += ' ORDER BY title';
  
  const result = await query(queryText, params);
  return result.rows.map(mapRowToJobTitle);
};

export const getJobTitleById = async (id: string): Promise<JobTitle | null> => {
  const result = await query('SELECT * FROM job_titles WHERE id = $1', [id]);
  return result.rows.length > 0 ? mapRowToJobTitle(result.rows[0]) : null;
};

export const createJobTitle = async (jobTitle: Omit<JobTitle, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobTitle> => {
  const result = await query(`
    INSERT INTO job_titles (title, description, department_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [jobTitle.title, jobTitle.description, jobTitle.departmentId]);
  
  return mapRowToJobTitle(result.rows[0]);
};

export const updateJobTitle = async (id: string, updates: Partial<JobTitle>): Promise<JobTitle> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id);
  
  await query(`
    UPDATE job_titles 
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramCount}
  `, values);

  return await getJobTitleById(id) as JobTitle;
};

export const deleteJobTitle = async (id: string): Promise<void> => {
  await query('DELETE FROM job_titles WHERE id = $1', [id]);
};