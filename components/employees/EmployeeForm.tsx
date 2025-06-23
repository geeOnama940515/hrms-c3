'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Briefcase,
  Shield,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee, EmploymentStatus, Gender, CivilStatus, Department, JobTitle, EmployeeDisplayData } from '@/types';
import { createEmployee, updateEmployee, getDepartments, getJobTitles } from '@/lib/employees';
import { toast } from 'sonner';

interface EmployeeFormProps {
  employee?: EmployeeDisplayData;
  onBack: () => void;
  onSave: (employee: EmployeeDisplayData) => void;
}

export default function EmployeeForm({ employee, onBack, onSave }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    middleName: employee?.middleName || '',
    birthDate: employee?.birthDate ? employee.birthDate.split('T')[0] : '',
    gender: employee?.gender || '',
    civilStatus: employee?.civilStatus || '',
    email: employee?.email || '',
    phoneNumber: employee?.phoneNumber || '',
    address: employee?.address || '',
    sssNumber: employee?.sssNumber || '',
    philHealthNumber: employee?.philHealthNumber || '',
    pagIbigNumber: employee?.pagIbigNumber || '',
    tin: employee?.tin || '',
    dateHired: employee?.dateHired ? employee.dateHired.split('T')[0] : '',
    employmentStatus: employee?.employmentStatus || '',
    departmentId: employee?.departmentId || '',
    jobTitleId: employee?.jobTitleId || '',
    employeeNumber: employee?.employeeNumber || '',
    companyId: employee?.companyId || 'company-1', // Default company for new employees
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadInitialData() {
      setLoadingData(true);
      try {
        const depts = await getDepartments();
        setDepartments(depts);
        if (employee?.departmentId) {
          const titles = await getJobTitles(employee.departmentId);
          setJobTitles(titles);
        }
      } catch (error) {
        toast.error('Failed to load initial form data.');
        console.error('Failed to load initial data:', error);
      } finally {
        setLoadingData(false);
      }
    }
    loadInitialData();
  }, [employee]);

  const handleDepartmentChange = async (departmentId: string) => {
    setFormData(prev => ({ ...prev, departmentId, jobTitleId: '' }));
    setJobTitles([]); // Clear job titles
    if (departmentId) {
      try {
        const titles = await getJobTitles(departmentId);
        setJobTitles(titles);
      } catch (error) {
        toast.error('Failed to load job titles for the selected department.');
        console.error('Failed to load job titles:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.civilStatus) newErrors.civilStatus = 'Civil status is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.employeeNumber.trim()) newErrors.employeeNumber = 'Employee number is required';
    if (!formData.dateHired) newErrors.dateHired = 'Date hired is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.jobTitleId) newErrors.jobTitleId = 'Job title is required';
    if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber && !/^(\+63|0)?[0-9]{10}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Philippine phone number';
    }

    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.birthDate = 'Employee must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const employeeData = {
        ...formData,
        gender: formData.gender as Gender,
        civilStatus: formData.civilStatus as CivilStatus,
        employmentStatus: formData.employmentStatus as EmploymentStatus,
      };

      let savedEmployee: EmployeeDisplayData;
      if (employee) {
        savedEmployee = await updateEmployee(employee.id, employeeData);
        toast.success('Employee updated successfully');
      } else {
        savedEmployee = await createEmployee(employeeData);
        toast.success('Employee created successfully');
      }
      onSave(savedEmployee);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <p className="text-gray-600">
            {employee ? 'Update employee information' : 'Create a new employee record'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center space-x-2"><User className="h-5 w-5" /><span>Personal Information</span></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={errors.firstName ? 'border-red-500' : ''} />
                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" value={formData.middleName} onChange={(e) => handleInputChange('middleName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={errors.lastName ? 'border-red-500' : ''} />
                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date *</Label>
                <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} className={errors.birthDate ? 'border-red-500' : ''} />
                {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="civilStatus">Civil Status *</Label>
                <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange('civilStatus', value)}>
                  <SelectTrigger className={errors.civilStatus ? 'border-red-500' : ''}><SelectValue placeholder="Select civil status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
                {errors.civilStatus && <p className="text-sm text-red-600">{errors.civilStatus}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center space-x-2"><Mail className="h-5 w-5" /><span>Contact Information</span></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="+63 917 123 4567" className={errors.phoneNumber ? 'border-red-500' : ''} />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Street, City, Province, ZIP Code, Philippines" rows={2} className={errors.address ? 'border-red-500' : ''} />
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5" /><span>Government IDs</span></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sssNumber">SSS Number</Label>
                <Input id="sssNumber" value={formData.sssNumber} onChange={(e) => handleInputChange('sssNumber', e.target.value)} placeholder="12-3456789-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="philHealthNumber">PhilHealth Number</Label>
                <Input id="philHealthNumber" value={formData.philHealthNumber} onChange={(e) => handleInputChange('philHealthNumber', e.target.value)} placeholder="PH123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagIbigNumber">Pag-IBIG Number</Label>
                <Input id="pagIbigNumber" value={formData.pagIbigNumber} onChange={(e) => handleInputChange('pagIbigNumber', e.target.value)} placeholder="PG123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tin">TIN</Label>
                <Input id="tin" value={formData.tin} onChange={(e) => handleInputChange('tin', e.target.value)} placeholder="123-456-789-000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center space-x-2"><Briefcase className="h-5 w-5" /><span>Employment Information</span></CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number *</Label>
                <Input id="employeeNumber" value={formData.employeeNumber} onChange={(e) => handleInputChange('employeeNumber', e.target.value)} placeholder="EMP001" className={errors.employeeNumber ? 'border-red-500' : ''} />
                {errors.employeeNumber && <p className="text-sm text-red-600">{errors.employeeNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateHired">Date Hired *</Label>
                <Input id="dateHired" type="date" value={formData.dateHired} onChange={(e) => handleInputChange('dateHired', e.target.value)} className={errors.dateHired ? 'border-red-500' : ''} />
                {errors.dateHired && <p className="text-sm text-red-600">{errors.dateHired}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.departmentId} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className={errors.departmentId ? 'border-red-500' : ''}><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(dep => (<SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.departmentId && <p className="text-sm text-red-600">{errors.departmentId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Select value={formData.jobTitleId} onValueChange={(value) => handleInputChange('jobTitleId', value)} disabled={!formData.departmentId || jobTitles.length === 0}>
                  <SelectTrigger className={errors.jobTitleId ? 'border-red-500' : ''}><SelectValue placeholder="Select job title" /></SelectTrigger>
                  <SelectContent>
                    {jobTitles.map(job => (<SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.jobTitleId && <p className="text-sm text-red-600">{errors.jobTitleId}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger className={errors.employmentStatus ? 'border-red-500' : ''}><SelectValue placeholder="Select employment status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Probationary">Probationary</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Contractual">Contractual</SelectItem>
                  <SelectItem value="ProjectBased">Project Based</SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentStatus && <p className="text-sm text-red-600">{errors.employmentStatus}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4 pb-6">
          <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{employee ? 'Updating...' : 'Creating...'}</>) : (<><Save className="mr-2 h-4 w-4" />{employee ? 'Update Employee' : 'Create Employee'}</>)}
          </Button>
        </div>
      </form>
    </div>
  );
}