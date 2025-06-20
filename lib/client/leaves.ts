import { LeaveApplication, LeaveBalance, LeaveStatus } from '@/types';

// Client-side API functions for leave management
export const getLeaveApplications = async (filters?: {
  employeeId?: string;
  departmentId?: string;
  status?: LeaveStatus;
  startDate?: string;
  endDate?: string;
}): Promise<LeaveApplication[]> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const url = `/api/leaves${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leave applications');
  }
  
  return response.json();
};

export const getLeaveApplicationById = async (id: string): Promise<LeaveApplication | null> => {
  const response = await fetch(`/api/leaves/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch leave application');
  }
  return response.json();
};

export const createLeaveApplication = async (
  application: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate' | 'createdAt' | 'updatedAt'>
): Promise<LeaveApplication> => {
  const response = await fetch('/api/leaves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create leave application');
  }
  
  return response.json();
};

export const updateLeaveApplication = async (
  id: string, 
  updates: Partial<LeaveApplication>
): Promise<LeaveApplication> => {
  const response = await fetch(`/api/leaves/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update leave application');
  }
  
  return response.json();
};

export const approveLeaveByDepartmentHead = async (
  id: string,
  approvedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  const response = await fetch(`/api/leaves/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approvedBy, comments }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to approve leave application');
  }
  
  return response.json();
};

export const acknowledgeLeaveByHR = async (
  id: string,
  acknowledgedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  const response = await fetch(`/api/leaves/${id}/acknowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ acknowledgedBy, comments }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to acknowledge leave application');
  }
  
  return response.json();
};

export const rejectLeaveApplication = async (
  id: string,
  rejectedBy: string,
  comments: string
): Promise<LeaveApplication> => {
  const response = await fetch(`/api/leaves/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rejectedBy, comments }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reject leave application');
  }
  
  return response.json();
};

export const deleteLeaveApplication = async (id: string): Promise<void> => {
  const response = await fetch(`/api/leaves/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete leave application');
  }
};

export const getLeaveBalance = async (employeeId: string, year?: number): Promise<LeaveBalance | null> => {
  const params = year ? `?year=${year}` : '';
  const response = await fetch(`/api/leaves/balance/${employeeId}${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leave balance');
  }
  
  return response.json();
};

// Utility functions (these can stay on client-side as they don't require database access)
export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  return diffDays;
};

export const generateLeaveDaysArray = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split('T')[0]);
  }
  
  return days;
};

export const getAvailablePaidLeave = (balance: LeaveBalance): number => {
  return balance.totalPaidLeave - balance.usedPaidLeave;
};

export const getLeaveTypeColor = (leaveType: string): string => {
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

export const getStatusColor = (status: string): string => {
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

export const getStatusDisplayName = (status: string): string => {
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