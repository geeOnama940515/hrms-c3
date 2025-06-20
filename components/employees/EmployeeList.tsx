'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee, EmploymentStatus } from '@/types';
import { getEmployees, getDepartments } from '@/lib/employees';
import { useAuth } from '@/contexts/AuthContext';
import { canEditEmployee, canDeleteEmployee } from '@/lib/auth';

interface EmployeeListProps {
  onEmployeeSelect: (employee: Employee) => void;
  onEmployeeEdit: (employee: Employee) => void;
  onEmployeeAdd: () => void;
}

export default function EmployeeList({ 
  onEmployeeSelect, 
  onEmployeeEdit, 
  onEmployeeAdd 
}: EmployeeListProps) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, departmentsData] = await Promise.all([
          getEmployees(),
          getDepartments()
        ]);
        setEmployees(employeesData);
        setDepartments(departmentsData.map(d => d.name));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.employmentStatus === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: EmploymentStatus) => {
    const variants: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline', className: string } } = {
      Regular: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      Probationary: { variant: 'outline', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
      Contractual: { variant: 'secondary', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      ProjectBased: { variant: 'secondary', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
      Resigned: { variant: 'destructive', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
      Terminated: { variant: 'destructive', className: 'bg-red-100 text-red-800 hover:bg-red-100' }
    };

    const config = variants[status] || variants.Regular;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-gray-600">Manage and view employee information</p>
        </div>
        {canEditEmployee(user?.role || 'EMPLOYEE') && (
          <Button onClick={onEmployeeAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Probationary">Probationary</SelectItem>
                <SelectItem value="Contractual">Contractual</SelectItem>
                <SelectItem value="ProjectBased">Project Based</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Showing {filteredEmployees.length} of {employees.length} employees
          </span>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid gap-4">
        {filteredEmployees.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || selectedDepartment !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first employee'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map(employee => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1" onClick={() => onEmployeeSelect(employee)}>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {employee.firstName} {employee.middleName && `${employee.middleName[0]}.`} {employee.lastName}
                        </h3>
                        {getStatusBadge(employee.employmentStatus)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="font-medium text-gray-700">{employee.jobTitle}</p>
                        <p className="text-gray-600">{employee.department}</p>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Age: {calculateAge(employee.birthDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{employee.civilStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-gray-500">
                      <p className="font-medium">ID: {employee.employeeNumber}</p>
                      <p>Hired: {formatDate(employee.dateHired)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEmployeeSelect(employee)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {canEditEmployee(user?.role || 'EMPLOYEE') && (
                          <DropdownMenuItem onClick={() => onEmployeeEdit(employee)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {canDeleteEmployee(user?.role || 'EMPLOYEE') && (
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}