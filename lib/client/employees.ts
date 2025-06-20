import { Employee, Department, JobTitle } from '@/types';

// Client-side API functions for employees
export const getEmployees = async (): Promise<Employee[]> => {
  const response = await fetch('/api/employees');
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const response = await fetch(`/api/employees/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch employee');
  }
  return response.json();
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employee),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
  
  return response.json();
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee> => {
  const response = await fetch(`/api/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
  
  return response.json();
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const response = await fetch(`/api/employees/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
};

// Department functions
export const getDepartments = async (): Promise<Department[]> => {
  const response = await fetch('/api/departments');
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  return response.json();
};

export const getDepartmentById = async (id: string): Promise<Department | null> => {
  const response = await fetch(`/api/departments/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch department');
  }
  return response.json();
};

export const createDepartment = async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> => {
  const response = await fetch('/api/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(department),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create department');
  }
  
  return response.json();
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  const response = await fetch(`/api/departments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update department');
  }
  
  return response.json();
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/departments/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete department');
  }
};

// Job Title functions
export const getJobTitles = async (departmentId?: string): Promise<JobTitle[]> => {
  const url = departmentId ? `/api/job-titles?departmentId=${departmentId}` : '/api/job-titles';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch job titles');
  }
  return response.json();
};

export const getJobTitleById = async (id: string): Promise<JobTitle | null> => {
  const response = await fetch(`/api/job-titles/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch job title');
  }
  return response.json();
};

export const createJobTitle = async (jobTitle: Omit<JobTitle, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobTitle> => {
  const response = await fetch('/api/job-titles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobTitle),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create job title');
  }
  
  return response.json();
};

export const updateJobTitle = async (id: string, updates: Partial<JobTitle>): Promise<JobTitle> => {
  const response = await fetch(`/api/job-titles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update job title');
  }
  
  return response.json();
};

export const deleteJobTitle = async (id: string): Promise<void> => {
  const response = await fetch(`/api/job-titles/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete job title');
  }
};