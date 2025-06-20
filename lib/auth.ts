import { query } from './db';
import { User, UserRole } from '@/types';

// Helper function to convert database row to User object
const mapRowToUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  role: row.role as UserRole,
  department: row.department,
  companyId: row.company_id,
  avatar: row.avatar
});

export const authenticate = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    
    // For demo purposes, we'll accept any password that equals "password123"
    // In production, you would hash the password and compare with stored hash
    if (password === 'password123') {
      return mapRowToUser(user);
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'HR_MANAGER':
      return 'HR Manager';
    case 'HR_SUPERVISOR':
      return 'HR Supervisor';
    case 'HR_COMPANY':
      return 'HR Company Level';
    case 'DEPARTMENT_HEAD':
      return 'Department Head';
    case 'EMPLOYEE':
      return 'Employee';
    default:
      return 'Unknown Role';
  }
};

export const canAccessEmployeeManagement = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY', 'DEPARTMENT_HEAD'].includes(role);
};

export const canEditEmployee = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY'].includes(role);
};

export const canDeleteEmployee = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR'].includes(role);
};

export const canManageCompany = (role: UserRole): boolean => {
  return role === 'HR_MANAGER';
};

export const canManageDepartments = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR'].includes(role);
};

export const canManageJobTitles = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY'].includes(role);
};

export const canApplyLeave = (role: UserRole): boolean => {
  return true; // All users can apply for leave
};

export const canApproveDepartmentLeave = (role: UserRole): boolean => {
  return role === 'DEPARTMENT_HEAD';
};

export const canAcknowledgeLeave = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY'].includes(role);
};

export const canViewAllLeaves = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY'].includes(role);
};

export const canViewDepartmentLeaves = (role: UserRole): boolean => {
  return ['HR_MANAGER', 'HR_SUPERVISOR', 'HR_COMPANY', 'DEPARTMENT_HEAD'].includes(role);
};

export const getAccessLevel = (role: UserRole): 'FULL' | 'COMPANY' | 'DEPARTMENT' | 'LIMITED' => {
  switch (role) {
    case 'HR_MANAGER':
      return 'FULL';
    case 'HR_SUPERVISOR':
      return 'COMPANY';
    case 'HR_COMPANY':
      return 'COMPANY';
    case 'DEPARTMENT_HEAD':
      return 'DEPARTMENT';
    case 'EMPLOYEE':
      return 'LIMITED';
    default:
      return 'LIMITED';
  }
};