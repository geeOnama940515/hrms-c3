'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Sidebar from '@/components/layout/Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import UpcomingBirthdays from '@/components/dashboard/UpcomingBirthdays';
import EmployeeList from '@/components/employees/EmployeeList';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import EmployeeForm from '@/components/employees/EmployeeForm';
import DepartmentList from '@/components/departments/DepartmentList';
import DepartmentForm from '@/components/departments/DepartmentForm';
import JobTitleList from '@/components/jobtitles/JobTitleList';
import JobTitleForm from '@/components/jobtitles/JobTitleForm';
import LeaveApplicationList from '@/components/leaves/LeaveApplicationList';
import LeaveApplicationForm from '@/components/leaves/LeaveApplicationForm';
import LeaveApplicationDetail from '@/components/leaves/LeaveApplicationDetail';
import MyProfile from '@/components/profile/MyProfile';
import { Employee, Department, JobTitle, LeaveApplication, EmployeeDisplayData, LeaveApplicationDisplayData } from '@/types';
import { Loader2, Package, Building2, Users, BarChart3 } from 'lucide-react';

// Get the brand prefix from environment variable, default to 'VMIS'
const brandPrefix = process.env.NEXT_PUBLIC_APP_BRAND_PREFIX || 'VMIS';

function Dashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDisplayData | null>(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const [isEditingJobTitle, setIsEditingJobTitle] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplicationDisplayData | null>(null);
  const [isEditingLeave, setIsEditingLeave] = useState(false);

  const handleEmployeeSelect = (employee: EmployeeDisplayData) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(false);
  };

  const handleEmployeeEdit = (employee: EmployeeDisplayData) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(true);
  };

  const handleEmployeeAdd = () => {
    setSelectedEmployee(null);
    setIsEditingEmployee(true);
  };

  const handleEmployeeBackToList = () => {
    setSelectedEmployee(null);
    setIsEditingEmployee(false);
  };

  const handleEmployeeSave = (employee: EmployeeDisplayData) => {
    setSelectedEmployee(employee);
    setIsEditingEmployee(false);
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditingDepartment(false);
  };

  const handleDepartmentEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditingDepartment(true);
  };

  const handleDepartmentAdd = () => {
    setSelectedDepartment(null);
    setIsEditingDepartment(true);
  };

  const handleDepartmentBackToList = () => {
    setSelectedDepartment(null);
    setIsEditingDepartment(false);
  };

  const handleDepartmentSave = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditingDepartment(false);
  };

  const handleJobTitleSelect = (jobTitle: JobTitle) => {
    setSelectedJobTitle(jobTitle);
    setIsEditingJobTitle(false);
  };

  const handleJobTitleEdit = (jobTitle: JobTitle) => {
    setSelectedJobTitle(jobTitle);
    setIsEditingJobTitle(true);
  };

  const handleJobTitleAdd = () => {
    setSelectedJobTitle(null);
    setIsEditingJobTitle(true);
  };

  const handleJobTitleBackToList = () => {
    setSelectedJobTitle(null);
    setIsEditingJobTitle(false);
  };

  const handleJobTitleSave = (jobTitle: JobTitle) => {
    setSelectedJobTitle(jobTitle);
    setIsEditingJobTitle(false);
  };

  const handleLeaveSelect = (leave: LeaveApplicationDisplayData) => {
    setSelectedLeave(leave);
    setIsEditingLeave(false);
  };

  const handleLeaveEdit = (leave: LeaveApplicationDisplayData) => {
    setSelectedLeave(leave);
    setIsEditingLeave(true);
  };

  const handleLeaveAdd = () => {
    setSelectedLeave(null);
    setIsEditingLeave(true);
  };

  const handleLeaveBackToList = () => {
    setSelectedLeave(null);
    setIsEditingLeave(false);
  };

  const handleLeaveSave = (leave: LeaveApplication) => {
    // Convert LeaveApplication to LeaveApplicationDisplayData
    const leaveDisplayData: LeaveApplicationDisplayData = {
      ...leave,
      employee: leave.employee ? {
        ...leave.employee,
        department: leave.employee.department?.name,
        jobTitle: leave.employee.jobTitle?.title,
        company: leave.employee.company?.name
      } as EmployeeDisplayData : undefined,
      departmentHead: leave.departmentHead ? {
        ...leave.departmentHead,
        department: leave.departmentHead.department?.name,
        jobTitle: leave.departmentHead.jobTitle?.title,
        company: leave.departmentHead.company?.name
      } as EmployeeDisplayData : undefined,
      hrPersonnel: leave.hrPersonnel ? {
        ...leave.hrPersonnel,
        department: leave.hrPersonnel.department?.name,
        jobTitle: leave.hrPersonnel.jobTitle?.title,
        company: leave.hrPersonnel.company?.name
      } as EmployeeDisplayData : undefined
    };
    setSelectedLeave(leaveDisplayData);
    setIsEditingLeave(false);
  };

  const handleLeaveUpdate = (leave: LeaveApplication) => {
    // Convert LeaveApplication to LeaveApplicationDisplayData
    const leaveDisplayData: LeaveApplicationDisplayData = {
      ...leave,
      employee: leave.employee ? {
        ...leave.employee,
        department: leave.employee.department?.name,
        jobTitle: leave.employee.jobTitle?.title,
        company: leave.employee.company?.name
      } as EmployeeDisplayData : undefined,
      departmentHead: leave.departmentHead ? {
        ...leave.departmentHead,
        department: leave.departmentHead.department?.name,
        jobTitle: leave.departmentHead.jobTitle?.title,
        company: leave.departmentHead.company?.name
      } as EmployeeDisplayData : undefined,
      hrPersonnel: leave.hrPersonnel ? {
        ...leave.hrPersonnel,
        department: leave.hrPersonnel.department?.name,
        jobTitle: leave.hrPersonnel.jobTitle?.title,
        company: leave.hrPersonnel.company?.name
      } as EmployeeDisplayData : undefined
    };
    setSelectedLeave(leaveDisplayData);
  };

  // Wrapper function for LeaveApplicationForm onSave callback
  const handleLeaveFormSave = (leave: LeaveApplication) => {
    handleLeaveSave(leave);
  };

  // Wrapper functions for LeaveApplicationDetail callbacks
  const handleLeaveDetailEdit = (leave: LeaveApplication) => {
    // Convert LeaveApplication to LeaveApplicationDisplayData
    const leaveDisplayData: LeaveApplicationDisplayData = {
      ...leave,
      employee: leave.employee ? {
        ...leave.employee,
        department: leave.employee.department?.name,
        jobTitle: leave.employee.jobTitle?.title,
        company: leave.employee.company?.name
      } as EmployeeDisplayData : undefined,
      departmentHead: leave.departmentHead ? {
        ...leave.departmentHead,
        department: leave.departmentHead.department?.name,
        jobTitle: leave.departmentHead.jobTitle?.title,
        company: leave.departmentHead.company?.name
      } as EmployeeDisplayData : undefined,
      hrPersonnel: leave.hrPersonnel ? {
        ...leave.hrPersonnel,
        department: leave.hrPersonnel.department?.name,
        jobTitle: leave.hrPersonnel.jobTitle?.title,
        company: leave.hrPersonnel.company?.name
      } as EmployeeDisplayData : undefined
    };
    setSelectedLeave(leaveDisplayData);
    setIsEditingLeave(true);
  };

  const handleLeaveDetailUpdate = (leave: LeaveApplication) => {
    // Convert LeaveApplication to LeaveApplicationDisplayData
    const leaveDisplayData: LeaveApplicationDisplayData = {
      ...leave,
      employee: leave.employee ? {
        ...leave.employee,
        department: leave.employee.department?.name,
        jobTitle: leave.employee.jobTitle?.title,
        company: leave.employee.company?.name
      } as EmployeeDisplayData : undefined,
      departmentHead: leave.departmentHead ? {
        ...leave.departmentHead,
        department: leave.departmentHead.department?.name,
        jobTitle: leave.departmentHead.jobTitle?.title,
        company: leave.departmentHead.company?.name
      } as EmployeeDisplayData : undefined,
      hrPersonnel: leave.hrPersonnel ? {
        ...leave.hrPersonnel,
        department: leave.hrPersonnel.department?.name,
        jobTitle: leave.hrPersonnel.jobTitle?.title,
        company: leave.hrPersonnel.company?.name
      } as EmployeeDisplayData : undefined
    };
    setSelectedLeave(leaveDisplayData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading {brandPrefix}-HRMS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (activeTab === 'employees') {
      if (isEditingEmployee) {
        return (
          <EmployeeForm
            key={selectedEmployee?.id || 'new'}
            employee={selectedEmployee || undefined}
            onBack={handleEmployeeBackToList}
            onSave={handleEmployeeSave}
          />
        );
      }
      
      if (selectedEmployee && !isEditingEmployee) {
        return (
          <EmployeeProfile
            employee={selectedEmployee}
            onBack={handleEmployeeBackToList}
            onEdit={handleEmployeeEdit}
          />
        );
      }

      return (
        <EmployeeList
          onEmployeeSelect={handleEmployeeSelect}
          onEmployeeEdit={handleEmployeeEdit}
          onEmployeeAdd={handleEmployeeAdd}
        />
      );
    }

    if (activeTab === 'leaves') {
      if (isEditingLeave) {
        // Convert LeaveApplicationDisplayData back to LeaveApplication for the form
        const leaveForForm = selectedLeave ? {
          ...selectedLeave,
          employee: selectedLeave.employee ? {
            ...selectedLeave.employee,
            department: selectedLeave.employee.department ? { name: selectedLeave.employee.department } as any : undefined,
            jobTitle: selectedLeave.employee.jobTitle ? { title: selectedLeave.employee.jobTitle } as any : undefined,
            company: selectedLeave.employee.company ? { name: selectedLeave.employee.company } as any : undefined
          } as any : undefined,
          departmentHead: selectedLeave.departmentHead ? {
            ...selectedLeave.departmentHead,
            department: selectedLeave.departmentHead.department ? { name: selectedLeave.departmentHead.department } as any : undefined,
            jobTitle: selectedLeave.departmentHead.jobTitle ? { title: selectedLeave.departmentHead.jobTitle } as any : undefined,
            company: selectedLeave.departmentHead.company ? { name: selectedLeave.departmentHead.company } as any : undefined
          } as any : undefined,
          hrPersonnel: selectedLeave.hrPersonnel ? {
            ...selectedLeave.hrPersonnel,
            department: selectedLeave.hrPersonnel.department ? { name: selectedLeave.hrPersonnel.department } as any : undefined,
            jobTitle: selectedLeave.hrPersonnel.jobTitle ? { title: selectedLeave.hrPersonnel.jobTitle } as any : undefined,
            company: selectedLeave.hrPersonnel.company ? { name: selectedLeave.hrPersonnel.company } as any : undefined
          } as any : undefined
        } as LeaveApplication : undefined;

        return (
          <LeaveApplicationForm
            key={selectedLeave?.id || 'new'}
            leaveApplication={leaveForForm}
            onBack={handleLeaveBackToList}
            onSave={handleLeaveFormSave}
          />
        );
      }
      
      if (selectedLeave && !isEditingLeave) {
        return (
          <LeaveApplicationDetail
            leaveApplication={selectedLeave}
            onBack={handleLeaveBackToList}
            onEdit={handleLeaveDetailEdit}
            onUpdate={handleLeaveDetailUpdate}
          />
        );
      }

      return (
        <LeaveApplicationList
          onLeaveSelect={handleLeaveSelect}
          onLeaveEdit={handleLeaveEdit}
          onLeaveAdd={handleLeaveAdd}
        />
      );
    }

    if (activeTab === 'departments') {
      if (isEditingDepartment) {
        return (
          <DepartmentForm
            key={selectedDepartment?.id || 'new'}
            department={selectedDepartment || undefined}
            onBack={handleDepartmentBackToList}
            onSave={handleDepartmentSave}
          />
        );
      }
      
      if (selectedDepartment && !isEditingDepartment) {
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Department Details</h3>
            <p className="text-gray-500">Department profile view will be implemented in the next update.</p>
          </div>
        );
      }

      return (
        <DepartmentList
          onDepartmentSelect={handleDepartmentSelect}
          onDepartmentEdit={handleDepartmentEdit}
          onDepartmentAdd={handleDepartmentAdd}
        />
      );
    }

    if (activeTab === 'job-titles') {
      if (isEditingJobTitle) {
        return (
          <JobTitleForm
            key={selectedJobTitle?.id || 'new'}
            jobTitle={selectedJobTitle || undefined}
            onBack={handleJobTitleBackToList}
            onSave={handleJobTitleSave}
          />
        );
      }
      
      if (selectedJobTitle && !isEditingJobTitle) {
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job Title Details</h3>
            <p className="text-gray-500">Job title profile view will be implemented in the next update.</p>
          </div>
        );
      }

      return (
        <JobTitleList
          onJobTitleSelect={handleJobTitleSelect}
          onJobTitleEdit={handleJobTitleEdit}
          onJobTitleAdd={handleJobTitleAdd}
        />
      );
    }

    if (activeTab === 'vendors') {
      return (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor Management</h3>
          <p className="text-gray-500">Vendor management system will be implemented in the next update.</p>
          <p className="text-sm text-gray-400 mt-2">Manage suppliers, contracts, and vendor relationships</p>
        </div>
      );
    }

    if (activeTab === 'my-profile') {
      return <MyProfile />;
    }

    if (activeTab === 'reports') {
      return (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
          <p className="text-gray-500">Advanced reporting and analytics dashboard will be implemented in the next update.</p>
          <p className="text-sm text-gray-400 mt-2">Employee reports, leave analytics, vendor performance metrics</p>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
          <p className="text-gray-500">System configuration and settings panel will be implemented in the next update.</p>
          <p className="text-sm text-gray-400 mt-2">Company settings, user management, system preferences</p>
        </div>
      );
    }

    // Dashboard
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your organization today.
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivity />
          <div className="space-y-6">
            <UpcomingBirthdays />
            
            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('leaves')}
                  className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors"
                >
                  → Apply for Leave
                </button>
                <button 
                  onClick={() => setActiveTab('employees')}
                  className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-100 rounded transition-colors"
                >
                  → View All Employees
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('employees');
                    handleEmployeeAdd();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-100 rounded transition-colors"
                >
                  → Add New Employee
                </button>
                <button 
                  onClick={() => setActiveTab('departments')}
                  className="w-full text-left px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded transition-colors"
                >
                  → Manage Departments
                </button>
                <button 
                  onClick={() => setActiveTab('vendors')}
                  className="w-full text-left px-3 py-2 text-sm text-orange-700 hover:bg-orange-100 rounded transition-colors"
                >
                  → Manage Vendors
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className="w-full text-left px-3 py-2 text-sm text-pink-700 hover:bg-pink-100 rounded transition-colors"
                >
                  → Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}