import { Employee, Department, JobTitle, Company, EmploymentStatus, Gender, CivilStatus } from '@/types';

// Mock companies
export const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'TechCorp Philippines',
    description: 'Leading technology company in the Philippines',
    address: 'BGC, Taguig City, Metro Manila, Philippines',
    contactEmail: 'info@techcorp.ph',
    contactPhone: '+63 2 8123 4567',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock departments with company hierarchy
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    companyId: 'company-1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Employee management and organizational development',
    companyId: 'company-1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Brand management and customer acquisition',
    companyId: 'company-1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Finance',
    description: 'Financial planning and accounting',
    companyId: 'company-1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Operations',
    description: 'Business operations and process management',
    companyId: 'company-1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock job titles with department hierarchy
export const mockJobTitles: JobTitle[] = [
  { 
    id: '1', 
    title: 'Software Engineer', 
    description: 'Develops and maintains software applications',
    departmentId: '1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '2', 
    title: 'Senior Developer', 
    description: 'Lead developer with advanced technical skills',
    departmentId: '1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '3', 
    title: 'UI/UX Designer', 
    description: 'Designs user interfaces and user experiences',
    departmentId: '1',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '4', 
    title: 'HR Specialist', 
    description: 'Manages human resources operations and employee relations',
    departmentId: '2',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '5', 
    title: 'Marketing Manager', 
    description: 'Oversees marketing strategies and campaigns',
    departmentId: '3',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '6', 
    title: 'Financial Analyst', 
    description: 'Analyzes financial data and provides insights',
    departmentId: '4',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '7', 
    title: 'Operations Manager', 
    description: 'Manages daily business operations and processes',
    departmentId: '5',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  { 
    id: '8', 
    title: 'Content Specialist', 
    description: 'Creates and manages content for marketing purposes',
    departmentId: '3',
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Updated mock employees with proper hierarchy
export const mockEmployees: Employee[] = [
  {
    id: '1',
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
    companyId: 'company-1',
    departmentId: '1',
    jobTitleId: '1',
    dateHired: '2023-01-15',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
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
    companyId: 'company-1',
    departmentId: '2',
    jobTitleId: '4',
    dateHired: '2023-02-01',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2023-02-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  },
  {
    id: '3',
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
    companyId: 'company-1',
    departmentId: '3',
    jobTitleId: '5',
    dateHired: '2022-11-15',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2022-11-15T08:00:00Z',
    updatedAt: '2023-11-15T08:00:00Z'
  },
  {
    id: '4',
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
    companyId: 'company-1',
    departmentId: '4',
    jobTitleId: '6',
    dateHired: '2023-03-01',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z'
  },
  {
    id: '5',
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
    companyId: 'company-1',
    departmentId: '1',
    jobTitleId: '2',
    dateHired: '2022-08-15',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2022-08-15T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: '6',
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
    companyId: 'company-1',
    departmentId: '1',
    jobTitleId: '3',
    dateHired: '2023-06-01',
    employmentStatus: 'Probationary',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '7',
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
    companyId: 'company-1',
    departmentId: '5',
    jobTitleId: '7',
    dateHired: '2021-09-20',
    employmentStatus: 'Regular',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2021-09-20T08:00:00Z',
    updatedAt: '2023-12-15T08:00:00Z'
  },
  {
    id: '8',
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
    companyId: 'company-1',
    departmentId: '3',
    jobTitleId: '8',
    dateHired: '2023-04-15',
    employmentStatus: 'Contractual',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    createdAt: '2023-04-15T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z'
  }
];

// Helper function to get display names
export const getEmployeeDisplayData = (employee: Employee) => {
  const department = mockDepartments.find(d => d.id === employee.departmentId);
  const jobTitle = mockJobTitles.find(jt => jt.id === employee.jobTitleId);
  const company = mockCompanies.find(c => c.id === employee.companyId);
  
  return {
    ...employee,
    department: department?.name || 'Unknown Department',
    jobTitle: jobTitle?.title || 'Unknown Job Title',
    company: company?.name || 'Unknown Company'
  };
};

// Company CRUD operations
export const getCompanies = async (): Promise<Company[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCompanies;
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCompanies.find(company => company.id === id) || null;
};

// Employee CRUD operations
export const getEmployees = async (): Promise<Employee[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEmployees.map(getEmployeeDisplayData);
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const employee = mockEmployees.find(emp => emp.id === id);
  return employee ? getEmployeeDisplayData(employee) : null;
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockEmployees.push(newEmployee);
  return getEmployeeDisplayData(newEmployee);
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockEmployees.findIndex(emp => emp.id === id);
  if (index === -1) throw new Error('Employee not found');
  
  const updatedEmployee = {
    ...mockEmployees[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  mockEmployees[index] = updatedEmployee;
  return getEmployeeDisplayData(updatedEmployee);
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockEmployees.findIndex(emp => emp.id === id);
  if (index === -1) throw new Error('Employee not found');
  mockEmployees.splice(index, 1);
};

// Department CRUD operations
export const getDepartments = async (): Promise<Department[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDepartments;
};

export const getDepartmentById = async (id: string): Promise<Department | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDepartments.find(dept => dept.id === id) || null;
};

export const createDepartment = async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newDepartment: Department = {
    ...department,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockDepartments.push(newDepartment);
  return newDepartment;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) throw new Error('Department not found');
  
  const updatedDepartment = {
    ...mockDepartments[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  mockDepartments[index] = updatedDepartment;
  return updatedDepartment;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockDepartments.findIndex(dept => dept.id === id);
  if (index === -1) throw new Error('Department not found');
  mockDepartments.splice(index, 1);
};

// Job Title CRUD operations
export const getJobTitles = async (departmentId?: string): Promise<JobTitle[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (departmentId) {
    return mockJobTitles.filter(title => title.departmentId === departmentId);
  }
  return mockJobTitles;
};

export const getJobTitleById = async (id: string): Promise<JobTitle | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockJobTitles.find(title => title.id === id) || null;
};

export const createJobTitle = async (jobTitle: Omit<JobTitle, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobTitle> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const newJobTitle: JobTitle = {
    ...jobTitle,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockJobTitles.push(newJobTitle);
  return newJobTitle;
};

export const updateJobTitle = async (id: string, updates: Partial<JobTitle>): Promise<JobTitle> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockJobTitles.findIndex(title => title.id === id);
  if (index === -1) throw new Error('Job title not found');
  
  const updatedJobTitle = {
    ...mockJobTitles[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  mockJobTitles[index] = updatedJobTitle;
  return updatedJobTitle;
};

export const deleteJobTitle = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockJobTitles.findIndex(title => title.id === id);
  if (index === -1) throw new Error('Job title not found');
  mockJobTitles.splice(index, 1);
};