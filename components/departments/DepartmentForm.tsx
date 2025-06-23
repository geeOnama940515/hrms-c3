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
  Building,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Department, Employee } from '@/types';
import { createDepartment, updateDepartment, getEmployees } from '@/lib/employees';
import { toast } from 'sonner';

// Type for employee with display data
interface EmployeeDisplayData extends Omit<Employee, 'department' | 'jobTitle' | 'company'> {
  department?: string;
  jobTitle?: string;
  company?: string;
}

interface DepartmentFormProps {
  department?: Department;
  onBack: () => void;
  onSave: (department: Department) => void;
}

export default function DepartmentForm({ department, onBack, onSave }: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: ''
  });
  const [employees, setEmployees] = useState<EmployeeDisplayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description || '',
        headId: department.headId || ''
      });
    }
    loadEmployees();
  }, [department]);

  const loadEmployees = async () => {
    try {
      const employeesData = await getEmployees();
      setEmployees(employeesData.filter(emp => emp.employmentStatus === 'Regular'));
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedDepartment: Department;
      
      if (department) {
        // Update existing department
        savedDepartment = await updateDepartment(department.id, {
          ...formData,
          description: formData.description || undefined,
          headId: formData.headId || undefined
        });
        toast.success('Department updated successfully');
      } else {
        // Create new department
        savedDepartment = await createDepartment({
          ...formData,
          description: formData.description || undefined,
          headId: formData.headId || undefined,
          companyId: '1'
        });
        toast.success('Department created successfully');
      }
      
      onSave(savedDepartment);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {department ? 'Edit Department' : 'Add New Department'}
          </h2>
          <p className="text-gray-600">
            {department ? 'Update department information' : 'Create a new department for your organization'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Department Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Department Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Engineering, Human Resources"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the department's role and responsibilities"
                  rows={3}
                />
              </div>

              {/* Department Head */}
              <div className="space-y-2">
                <Label htmlFor="headId">Department Head</Label>
                <Select
                  value={formData.headId}
                  onValueChange={(value) => handleInputChange('headId', value)}
                  disabled={loadingEmployees}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEmployees ? "Loading employees..." : "Select department head"} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.jobTitle ?? 'No Title'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {department ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {department ? 'Update Department' : 'Create Department'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}