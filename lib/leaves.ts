import { LeaveApplication, LeaveBalance, LeaveType, LeaveStatus, Employee } from '@/types';
import { mockEmployees, getEmployeeDisplayData } from './employees';

// Mock leave balances - simplified to track only paid leave
export const mockLeaveBalances: LeaveBalance[] = [
  {
    id: '1',
    employeeId: '1',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 2
  },
  {
    id: '2',
    employeeId: '2',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 1
  },
  {
    id: '3',
    employeeId: '3',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 0
  },
  {
    id: '4',
    employeeId: '4',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 1
  },
  {
    id: '5',
    employeeId: '5',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 3
  },
  {
    id: '6',
    employeeId: '6',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 0
  },
  {
    id: '7',
    employeeId: '7',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 2
  },
  {
    id: '8',
    employeeId: '8',
    year: 2024,
    totalPaidLeave: 5,
    usedPaidLeave: 1
  }
];

// Mock leave applications - updated with isPaid field
export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: '1',
    employeeId: '1',
    leaveType: 'Vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    totalDays: 5,
    isPaid: true,
    reason: 'Family vacation to Boracay',
    status: 'Approved',
    appliedDate: '2024-02-01T08:00:00Z',
    departmentHeadApproval: {
      approvedBy: '4',
      approvedDate: '2024-02-02T10:30:00Z',
      comments: 'Approved. Enjoy your vacation!'
    },
    hrAcknowledgment: {
      acknowledgedBy: '2',
      acknowledgedDate: '2024-02-02T14:15:00Z',
      comments: 'Leave acknowledged and processed.'
    },
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-02T14:15:00Z'
  },
  {
    id: '2',
    employeeId: '6',
    leaveType: 'Sick',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    totalDays: 2,
    isPaid: true,
    reason: 'Flu symptoms and fever',
    status: 'Approved_by_Department',
    appliedDate: '2024-01-24T09:00:00Z',
    departmentHeadApproval: {
      approvedBy: '4',
      approvedDate: '2024-01-24T11:00:00Z',
      comments: 'Get well soon!'
    },
    createdAt: '2024-01-24T09:00:00Z',
    updatedAt: '2024-01-24T11:00:00Z'
  },
  {
    id: '3',
    employeeId: '3',
    leaveType: 'Personal',
    startDate: '2024-03-01',
    endDate: '2024-03-01',
    totalDays: 1,
    isPaid: false,
    reason: 'Personal matters to attend to',
    status: 'Pending',
    appliedDate: '2024-02-20T10:00:00Z',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z'
  }
];

// Helper function to get leave application with employee data
export const getLeaveApplicationDisplayData = (leave: LeaveApplication) => {
  const employee = mockEmployees.find(emp => emp.id === leave.employeeId);
  const departmentHead = leave.departmentHeadApproval 
    ? mockEmployees.find(emp => emp.id === leave.departmentHeadApproval!.approvedBy)
    : undefined;
  const hrPersonnel = leave.hrAcknowledgment
    ? mockEmployees.find(emp => emp.id === leave.hrAcknowledgment!.acknowledgedBy)
    : undefined;

  return {
    ...leave,
    employee: employee ? getEmployeeDisplayData(employee) : undefined,
    departmentHead: departmentHead ? getEmployeeDisplayData(departmentHead) : undefined,
    hrPersonnel: hrPersonnel ? getEmployeeDisplayData(hrPersonnel) : undefined
  };
};

// Leave Application CRUD operations
export const getLeaveApplications = async (filters?: {
  employeeId?: string;
  departmentId?: string;
  status?: LeaveStatus;
  startDate?: string;
  endDate?: string;
}): Promise<LeaveApplication[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredApplications = mockLeaveApplications;
  
  if (filters) {
    if (filters.employeeId) {
      filteredApplications = filteredApplications.filter(app => app.employeeId === filters.employeeId);
    }
    if (filters.departmentId) {
      filteredApplications = filteredApplications.filter(app => {
        const employee = mockEmployees.find(emp => emp.id === app.employeeId);
        return employee?.departmentId === filters.departmentId;
      });
    }
    if (filters.status) {
      filteredApplications = filteredApplications.filter(app => app.status === filters.status);
    }
    if (filters.startDate) {
      filteredApplications = filteredApplications.filter(app => app.startDate >= filters.startDate!);
    }
    if (filters.endDate) {
      filteredApplications = filteredApplications.filter(app => app.endDate <= filters.endDate!);
    }
  }
  
  return filteredApplications.map(getLeaveApplicationDisplayData);
};

export const getLeaveApplicationById = async (id: string): Promise<LeaveApplication | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const application = mockLeaveApplications.find(app => app.id === id);
  return application ? getLeaveApplicationDisplayData(application) : null;
};

export const createLeaveApplication = async (
  application: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate' | 'createdAt' | 'updatedAt'>
): Promise<LeaveApplication> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newApplication: LeaveApplication = {
    ...application,
    id: Date.now().toString(),
    status: 'Pending',
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveApplications.push(newApplication);
  return getLeaveApplicationDisplayData(newApplication);
};

export const updateLeaveApplication = async (
  id: string, 
  updates: Partial<LeaveApplication>
): Promise<LeaveApplication> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockLeaveApplications.findIndex(app => app.id === id);
  if (index === -1) throw new Error('Leave application not found');
  
  const updatedApplication = {
    ...mockLeaveApplications[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveApplications[index] = updatedApplication;
  return getLeaveApplicationDisplayData(updatedApplication);
};

export const approveLeaveByDepartmentHead = async (
  id: string,
  approvedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockLeaveApplications.findIndex(app => app.id === id);
  if (index === -1) throw new Error('Leave application not found');
  
  const updatedApplication = {
    ...mockLeaveApplications[index],
    status: 'Approved_by_Department' as LeaveStatus,
    departmentHeadApproval: {
      approvedBy,
      approvedDate: new Date().toISOString(),
      comments
    },
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveApplications[index] = updatedApplication;
  return getLeaveApplicationDisplayData(updatedApplication);
};

export const acknowledgeLeaveByHR = async (
  id: string,
  acknowledgedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockLeaveApplications.findIndex(app => app.id === id);
  if (index === -1) throw new Error('Leave application not found');
  
  const application = mockLeaveApplications[index];
  if (application.status !== 'Approved_by_Department') {
    throw new Error('Leave must be approved by department head first');
  }
  
  const updatedApplication = {
    ...application,
    status: 'Approved' as LeaveStatus,
    hrAcknowledgment: {
      acknowledgedBy,
      acknowledgedDate: new Date().toISOString(),
      comments
    },
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveApplications[index] = updatedApplication;
  
  // Update leave balance if it's a paid leave
  if (updatedApplication.isPaid) {
    await updateLeaveBalance(updatedApplication.employeeId, updatedApplication.totalDays);
  }
  
  return getLeaveApplicationDisplayData(updatedApplication);
};

export const rejectLeaveApplication = async (
  id: string,
  rejectedBy: string,
  comments: string
): Promise<LeaveApplication> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const index = mockLeaveApplications.findIndex(app => app.id === id);
  if (index === -1) throw new Error('Leave application not found');
  
  const updatedApplication = {
    ...mockLeaveApplications[index],
    status: 'Rejected' as LeaveStatus,
    departmentHeadApproval: {
      approvedBy: rejectedBy,
      approvedDate: new Date().toISOString(),
      comments
    },
    updatedAt: new Date().toISOString()
  };
  
  mockLeaveApplications[index] = updatedApplication;
  return getLeaveApplicationDisplayData(updatedApplication);
};

export const deleteLeaveApplication = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const index = mockLeaveApplications.findIndex(app => app.id === id);
  if (index === -1) throw new Error('Leave application not found');
  mockLeaveApplications.splice(index, 1);
};

// Leave Balance operations
export const getLeaveBalance = async (employeeId: string, year: number = new Date().getFullYear()): Promise<LeaveBalance | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLeaveBalances.find(balance => balance.employeeId === employeeId && balance.year === year) || null;
};

export const updateLeaveBalance = async (
  employeeId: string,
  daysUsed: number,
  year: number = new Date().getFullYear()
): Promise<LeaveBalance> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let balance = mockLeaveBalances.find(b => b.employeeId === employeeId && b.year === year);
  
  if (!balance) {
    // Create new balance record if it doesn't exist
    balance = {
      id: Date.now().toString(),
      employeeId,
      year,
      totalPaidLeave: 5,
      usedPaidLeave: 0
    };
    mockLeaveBalances.push(balance);
  }
  
  // Update used paid leave
  balance.usedPaidLeave += daysUsed;
  
  return balance;
};

// Utility functions
export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  return diffDays;
};

export const getAvailablePaidLeave = (balance: LeaveBalance): number => {
  return balance.totalPaidLeave - balance.usedPaidLeave;
};

export const getLeaveTypeColor = (leaveType: LeaveType): string => {
  switch (leaveType) {
    case 'Vacation':
      return 'bg-blue-100 text-blue-800';
    case 'Sick':
      return 'bg-red-100 text-red-800';
    case 'Emergency':
      return 'bg-orange-100 text-orange-800';
    case 'Maternity':
      return 'bg-pink-100 text-pink-800';
    case 'Paternity':
      return 'bg-green-100 text-green-800';
    case 'Bereavement':
      return 'bg-gray-100 text-gray-800';
    case 'Personal':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: LeaveStatus): string => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Approved_by_Department':
      return 'bg-blue-100 text-blue-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusDisplayName = (status: LeaveStatus): string => {
  switch (status) {
    case 'Pending':
      return 'Pending Approval';
    case 'Approved_by_Department':
      return 'Approved by Department';
    case 'Approved':
      return 'Fully Approved';
    case 'Rejected':
      return 'Rejected';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};