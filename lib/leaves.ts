import { query } from './db';
import { LeaveApplication, LeaveBalance, LeaveType, LeaveStatus, Employee, LeaveDay } from '@/types';

// Helper function to convert database row to LeaveApplication object
const mapRowToLeaveApplication = (row: any): LeaveApplication => ({
  id: row.id,
  employeeId: row.employee_id,
  leaveType: row.leave_type as LeaveType,
  startDate: row.start_date,
  endDate: row.end_date,
  totalDays: row.total_days,
  paidDays: row.paid_days,
  unpaidDays: row.unpaid_days,
  reason: row.reason,
  status: row.status as LeaveStatus,
  appliedDate: row.applied_date,
  departmentHeadApproval: row.department_head_approved_by ? {
    approvedBy: row.department_head_approved_by,
    approvedDate: row.department_head_approved_date,
    comments: row.department_head_comments
  } : undefined,
  hrAcknowledgment: row.hr_acknowledged_by ? {
    acknowledgedBy: row.hr_acknowledged_by,
    acknowledgedDate: row.hr_acknowledged_date,
    comments: row.hr_comments
  } : undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  leaveDays: []
});

const mapRowToLeaveBalance = (row: any): LeaveBalance => ({
  id: row.id,
  employeeId: row.employee_id,
  year: row.year,
  totalPaidLeave: row.total_paid_leave,
  usedPaidLeave: row.used_paid_leave
});

const mapRowToLeaveDay = (row: any): LeaveDay => ({
  date: row.date,
  isPaid: row.is_paid
});

// Helper function to get leave application with employee data
export const getLeaveApplicationDisplayData = async (leave: LeaveApplication) => {
  // Get employee data
  const employeeResult = await query(`
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
  `, [leave.employeeId]);

  // Get department head data if exists
  let departmentHead = undefined;
  if (leave.departmentHeadApproval?.approvedBy) {
    const deptHeadResult = await query(`
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
    `, [leave.departmentHeadApproval.approvedBy]);
    
    if (deptHeadResult.rows.length > 0) {
      const row = deptHeadResult.rows[0];
      departmentHead = {
        id: row.id,
        employeeNumber: row.employee_number,
        firstName: row.first_name,
        lastName: row.last_name,
        middleName: row.middle_name,
        birthDate: row.birth_date,
        gender: row.gender,
        civilStatus: row.civil_status,
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
        employmentStatus: row.employment_status,
        avatar: row.avatar,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        department: row.department_name,
        jobTitle: row.job_title,
        company: row.company_name
      };
    }
  }

  // Get HR personnel data if exists
  let hrPersonnel = undefined;
  if (leave.hrAcknowledgment?.acknowledgedBy) {
    const hrResult = await query(`
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
    `, [leave.hrAcknowledgment.acknowledgedBy]);
    
    if (hrResult.rows.length > 0) {
      const row = hrResult.rows[0];
      hrPersonnel = {
        id: row.id,
        employeeNumber: row.employee_number,
        firstName: row.first_name,
        lastName: row.last_name,
        middleName: row.middle_name,
        birthDate: row.birth_date,
        gender: row.gender,
        civilStatus: row.civil_status,
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
        employmentStatus: row.employment_status,
        avatar: row.avatar,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        department: row.department_name,
        jobTitle: row.job_title,
        company: row.company_name
      };
    }
  }

  // Get leave days
  const leaveDaysResult = await query(
    'SELECT * FROM leave_days WHERE leave_application_id = $1 ORDER BY date',
    [leave.id]
  );

  const employee = employeeResult.rows.length > 0 ? {
    id: employeeResult.rows[0].id,
    employeeNumber: employeeResult.rows[0].employee_number,
    firstName: employeeResult.rows[0].first_name,
    lastName: employeeResult.rows[0].last_name,
    middleName: employeeResult.rows[0].middle_name,
    birthDate: employeeResult.rows[0].birth_date,
    gender: employeeResult.rows[0].gender,
    civilStatus: employeeResult.rows[0].civil_status,
    email: employeeResult.rows[0].email,
    phoneNumber: employeeResult.rows[0].phone_number,
    address: employeeResult.rows[0].address,
    sssNumber: employeeResult.rows[0].sss_number,
    philHealthNumber: employeeResult.rows[0].philhealth_number,
    pagIbigNumber: employeeResult.rows[0].pagibig_number,
    tin: employeeResult.rows[0].tin,
    companyId: employeeResult.rows[0].company_id,
    departmentId: employeeResult.rows[0].department_id,
    jobTitleId: employeeResult.rows[0].job_title_id,
    dateHired: employeeResult.rows[0].date_hired,
    employmentStatus: employeeResult.rows[0].employment_status,
    avatar: employeeResult.rows[0].avatar,
    createdAt: employeeResult.rows[0].created_at,
    updatedAt: employeeResult.rows[0].updated_at,
    department: employeeResult.rows[0].department_name,
    jobTitle: employeeResult.rows[0].job_title,
    company: employeeResult.rows[0].company_name
  } : undefined;

  return {
    ...leave,
    employee,
    departmentHead,
    hrPersonnel,
    leaveDays: leaveDaysResult.rows.map(mapRowToLeaveDay)
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
  let queryText = 'SELECT * FROM leave_applications WHERE 1=1';
  const params = [];
  let paramCount = 1;
  
  if (filters) {
    if (filters.employeeId) {
      queryText += ` AND employee_id = $${paramCount}`;
      params.push(filters.employeeId);
      paramCount++;
    }
    if (filters.departmentId) {
      queryText += ` AND employee_id IN (SELECT id FROM employees WHERE department_id = $${paramCount})`;
      params.push(filters.departmentId);
      paramCount++;
    }
    if (filters.status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }
    if (filters.startDate) {
      queryText += ` AND start_date >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }
    if (filters.endDate) {
      queryText += ` AND end_date <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }
  }
  
  queryText += ' ORDER BY applied_date DESC';
  
  const result = await query(queryText, params);
  const applications = result.rows.map(mapRowToLeaveApplication);
  
  // Get display data for each application
  const applicationsWithData = await Promise.all(
    applications.map(app => getLeaveApplicationDisplayData(app))
  );
  
  return applicationsWithData;
};

export const getLeaveApplicationById = async (id: string): Promise<LeaveApplication | null> => {
  const result = await query('SELECT * FROM leave_applications WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  
  const application = mapRowToLeaveApplication(result.rows[0]);
  return await getLeaveApplicationDisplayData(application);
};

export const createLeaveApplication = async (
  application: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate' | 'createdAt' | 'updatedAt'>
): Promise<LeaveApplication> => {
  const client = await query('BEGIN');
  
  try {
    // Insert leave application
    const result = await query(`
      INSERT INTO leave_applications (
        employee_id, leave_type, start_date, end_date, total_days, paid_days, unpaid_days, reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      application.employeeId, application.leaveType, application.startDate, application.endDate,
      application.totalDays, application.paidDays, application.unpaidDays, application.reason
    ]);
    
    const newApplication = mapRowToLeaveApplication(result.rows[0]);
    
    // Insert leave days
    if (application.leaveDays && application.leaveDays.length > 0) {
      for (const day of application.leaveDays) {
        await query(`
          INSERT INTO leave_days (leave_application_id, date, is_paid)
          VALUES ($1, $2, $3)
        `, [newApplication.id, day.date, day.isPaid]);
      }
    }
    
    await query('COMMIT');
    return await getLeaveApplicationDisplayData(newApplication) as LeaveApplication;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

export const updateLeaveApplication = async (
  id: string, 
  updates: Partial<LeaveApplication>
): Promise<LeaveApplication> => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'leaveDays') {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length > 0) {
    values.push(id);
    await query(`
      UPDATE leave_applications 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
    `, values);
  }

  // Update leave days if provided
  if (updates.leaveDays) {
    // Delete existing leave days
    await query('DELETE FROM leave_days WHERE leave_application_id = $1', [id]);
    
    // Insert new leave days
    for (const day of updates.leaveDays) {
      await query(`
        INSERT INTO leave_days (leave_application_id, date, is_paid)
        VALUES ($1, $2, $3)
      `, [id, day.date, day.isPaid]);
    }
  }

  return await getLeaveApplicationById(id) as LeaveApplication;
};

export const approveLeaveByDepartmentHead = async (
  id: string,
  approvedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  await query(`
    UPDATE leave_applications 
    SET 
      status = 'Approved_by_Department',
      department_head_approved_by = $1,
      department_head_approved_date = NOW(),
      department_head_comments = $2,
      updated_at = NOW()
    WHERE id = $3
  `, [approvedBy, comments, id]);
  
  return await getLeaveApplicationById(id) as LeaveApplication;
};

export const acknowledgeLeaveByHR = async (
  id: string,
  acknowledgedBy: string,
  comments?: string
): Promise<LeaveApplication> => {
  const client = await query('BEGIN');
  
  try {
    // Update leave application
    await query(`
      UPDATE leave_applications 
      SET 
        status = 'Approved',
        hr_acknowledged_by = $1,
        hr_acknowledged_date = NOW(),
        hr_comments = $2,
        updated_at = NOW()
      WHERE id = $3
    `, [acknowledgedBy, comments, id]);
    
    // Get the leave application to update balance
    const leaveResult = await query('SELECT * FROM leave_applications WHERE id = $1', [id]);
    const leave = leaveResult.rows[0];
    
    // Update leave balance for paid days when fully approved
    if (leave.paid_days > 0) {
      await updateLeaveBalance(leave.employee_id, leave.paid_days);
    }
    
    await query('COMMIT');
    return await getLeaveApplicationById(id) as LeaveApplication;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

export const rejectLeaveApplication = async (
  id: string,
  rejectedBy: string,
  comments: string
): Promise<LeaveApplication> => {
  await query(`
    UPDATE leave_applications 
    SET 
      status = 'Rejected',
      department_head_approved_by = $1,
      department_head_approved_date = NOW(),
      department_head_comments = $2,
      updated_at = NOW()
    WHERE id = $3
  `, [rejectedBy, comments, id]);
  
  return await getLeaveApplicationById(id) as LeaveApplication;
};

export const deleteLeaveApplication = async (id: string): Promise<void> => {
  const client = await query('BEGIN');
  
  try {
    // Delete leave days first (foreign key constraint)
    await query('DELETE FROM leave_days WHERE leave_application_id = $1', [id]);
    
    // Delete leave application
    await query('DELETE FROM leave_applications WHERE id = $1', [id]);
    
    await query('COMMIT');
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

// Leave Balance operations
export const getLeaveBalance = async (employeeId: string, year: number = new Date().getFullYear()): Promise<LeaveBalance | null> => {
  const result = await query(
    'SELECT * FROM leave_balances WHERE employee_id = $1 AND year = $2',
    [employeeId, year]
  );
  
  if (result.rows.length === 0) {
    // Create default balance if it doesn't exist
    const newBalance = await query(`
      INSERT INTO leave_balances (employee_id, year, total_paid_leave, used_paid_leave)
      VALUES ($1, $2, 5, 0)
      RETURNING *
    `, [employeeId, year]);
    
    return mapRowToLeaveBalance(newBalance.rows[0]);
  }
  
  return mapRowToLeaveBalance(result.rows[0]);
};

export const updateLeaveBalance = async (
  employeeId: string,
  paidDaysUsed: number,
  year: number = new Date().getFullYear()
): Promise<LeaveBalance> => {
  // Get or create balance
  let balance = await getLeaveBalance(employeeId, year);
  
  if (!balance) {
    throw new Error('Unable to create leave balance');
  }
  
  // Update used paid leave
  await query(`
    UPDATE leave_balances 
    SET used_paid_leave = used_paid_leave + $1, updated_at = NOW()
    WHERE employee_id = $2 AND year = $3
  `, [paidDaysUsed, employeeId, year]);
  
  return await getLeaveBalance(employeeId, year) as LeaveBalance;
};

// Utility functions
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