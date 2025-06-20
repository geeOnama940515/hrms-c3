import { User, UserRole } from '@/types';

// Mock users for demonstration with updated HR roles
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'hr.manager@company.com',
    password: 'password123',
    firstName: 'Maria',
    lastName: 'Santos',
    role: 'HR_MANAGER',
    companyId: 'company-1',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'hr.supervisor@company.com',
    password: 'password123',
    firstName: 'Jose',
    lastName: 'Dela Cruz',
    role: 'HR_SUPERVISOR',
    department: 'HR',
    companyId: 'company-1',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    email: 'hr.company@company.com',
    password: 'password123',
    firstName: 'Carmen',
    lastName: 'Rodriguez',
    role: 'HR_COMPANY',
    department: 'HR',
    companyId: 'company-1',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    email: 'dept.head@company.com',
    password: 'password123',
    firstName: 'Ana',
    lastName: 'Reyes',
    role: 'DEPARTMENT_HEAD',
    department: 'Engineering',
    companyId: 'company-1',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '5',
    email: 'employee@company.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Mendoza',
    role: 'EMPLOYEE',
    department: 'Engineering',
    companyId: 'company-1',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const authenticate = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
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