'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  User, 
  FileText,
  Shield,
  Heart,
  CreditCard,
  Receipt,
  Cake,
  Users
} from 'lucide-react';
import { Employee, EmploymentStatus, EmployeeDisplayData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { canEditEmployee } from '@/lib/auth';

interface EmployeeProfileProps {
  employee: EmployeeDisplayData;
  onBack: () => void;
  onEdit: (employee: EmployeeDisplayData) => void;
}

export default function EmployeeProfile({ employee, onBack, onEdit }: EmployeeProfileProps) {
  const { user } = useAuth();

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
      month: 'long',
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

  const calculateTenure = (hireDate: string) => {
    const today = new Date();
    const hired = new Date(hireDate);
    const diffTime = Math.abs(today.getTime() - hired.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employee Profile</h2>
            <p className="text-gray-600">Complete employee information and records</p>
          </div>
        </div>
        {canEditEmployee(user?.role || 'EMPLOYEE') && (
          <Button onClick={() => onEdit(employee)} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal & Employment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {employee.firstName} {employee.middleName && `${employee.middleName} `}{employee.lastName}
                  </h3>
                  {getStatusBadge(employee.employmentStatus)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{employee.jobTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-medium">{employee.employeeNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Tenure:</span>
                    <span className="font-medium">{calculateTenure(employee.dateHired)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Personal Details</span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Cake className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Birth Date:</span>
                    <span className="text-gray-900">{formatDate(employee.birthDate)} ({calculateAge(employee.birthDate)} years old)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Gender:</span>
                    <span className="text-gray-900">{employee.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Civil Status:</span>
                    <span className="text-gray-900">{employee.civilStatus}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Information</span>
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">
                      {employee.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <a href={`tel:${employee.phoneNumber}`} className="text-blue-600 hover:underline">
                      {employee.phoneNumber}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">Address:</span>
                    <span className="text-gray-900">{employee.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Employment Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Employment Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Date Hired:</span>
                  <span className="text-gray-900">{formatDate(employee.dateHired)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Employment Status:</span>
                  <span className="text-gray-900">{employee.employmentStatus}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Government IDs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Government IDs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                {employee.sssNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">SSS:</span>
                    <span className="font-medium">{employee.sssNumber}</span>
                  </div>
                )}
                {employee.philHealthNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">PhilHealth:</span>
                    <span className="font-medium">{employee.philHealthNumber}</span>
                  </div>
                )}
                {employee.pagIbigNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pag-IBIG:</span>
                    <span className="font-medium">{employee.pagIbigNumber}</span>
                  </div>
                )}
                {employee.tin && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">TIN:</span>
                    <span className="font-medium">{employee.tin}</span>
                  </div>
                )}
              </div>
              {!employee.sssNumber && !employee.philHealthNumber && 
               !employee.pagIbigNumber && !employee.tin && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No government IDs on file
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                  {calculateAge(employee.birthDate)}
                </div>
                <p className="text-sm text-gray-600">Years Old</p>
              </div>
              <Separator />
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {calculateTenure(employee.dateHired).split(',')[0]}
                </div>
                <p className="text-sm text-gray-600">With Company</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Record Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Created:</span>
                  <span className="text-gray-900">{formatDate(employee.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{formatDate(employee.updatedAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date Hired:</span>
                  <span className="text-gray-900">{formatDate(employee.dateHired)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}