'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  DollarSign,
  Ban
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LeaveApplication, LeaveStatus, LeaveType } from '@/types';
import { getLeaveApplications, deleteLeaveApplication, getLeaveTypeColor, getStatusColor, getStatusDisplayName } from '@/lib/leaves';
import { useAuth } from '@/contexts/AuthContext';
import { canApplyLeave, canViewAllLeaves, canViewDepartmentLeaves, getAccessLevel } from '@/lib/auth';
import { toast } from 'sonner';

interface LeaveApplicationListProps {
  onLeaveSelect: (leave: LeaveApplication) => void;
  onLeaveEdit: (leave: LeaveApplication) => void;
  onLeaveAdd: () => void;
}

export default function LeaveApplicationList({ 
  onLeaveSelect, 
  onLeaveEdit, 
  onLeaveAdd 
}: LeaveApplicationListProps) {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [paidFilter, setPaidFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState<LeaveApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLeaveApplications();
  }, [user]);

  const loadLeaveApplications = async () => {
    if (!user) return;
    
    try {
      const accessLevel = getAccessLevel(user.role);
      let filters: any = {};
      
      // Apply filters based on user role
      if (accessLevel === 'LIMITED') {
        // Employee can only see their own leaves
        filters.employeeId = '1'; // In real app, get from user context
      } else if (accessLevel === 'DEPARTMENT') {
        // Department head can see leaves from their department
        filters.departmentId = '1'; // In real app, get from user's department
      }
      // HR roles can see all leaves (no filters)
      
      const leavesData = await getLeaveApplications(filters);
      setLeaves(leavesData);
    } catch (error) {
      console.error('Error loading leave applications:', error);
      toast.error('Failed to load leave applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.employee?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    const matchesPaid = paidFilter === 'all' || 
      (paidFilter === 'paid' && leave.isPaid) || 
      (paidFilter === 'unpaid' && !leave.isPaid);

    return matchesSearch && matchesStatus && matchesType && matchesPaid;
  });

  const handleDeleteClick = (leave: LeaveApplication) => {
    setLeaveToDelete(leave);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leaveToDelete) return;
    
    setDeleting(true);
    try {
      await deleteLeaveApplication(leaveToDelete.id);
      setLeaves(leaves.filter(l => l.id !== leaveToDelete.id));
      toast.success('Leave application deleted successfully');
    } catch (error) {
      console.error('Error deleting leave application:', error);
      toast.error('Failed to delete leave application');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setLeaveToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Approved_by_Department':
        return <CheckCircle className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canEditLeave = (leave: LeaveApplication): boolean => {
    // Only the applicant can edit, and only if it's still pending
    return leave.status === 'Pending' && leave.employeeId === '1'; // In real app, check against user ID
  };

  const canDeleteLeave = (leave: LeaveApplication): boolean => {
    // Only the applicant can delete, and only if it's still pending
    return leave.status === 'Pending' && leave.employeeId === '1'; // In real app, check against user ID
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
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">
            {getAccessLevel(user?.role || 'EMPLOYEE') === 'LIMITED' 
              ? 'View and manage your leave applications'
              : 'Manage leave applications and approvals'
            }
          </p>
        </div>
        {canApplyLeave(user?.role || 'EMPLOYEE') && (
          <Button onClick={onLeaveAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Apply for Leave
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
                placeholder="Search leave applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved_by_Department">Approved by Department</SelectItem>
                <SelectItem value="Approved">Fully Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Vacation">Vacation</SelectItem>
                <SelectItem value="Sick">Sick</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Maternity">Maternity</SelectItem>
                <SelectItem value="Paternity">Paternity</SelectItem>
                <SelectItem value="Bereavement">Bereavement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paidFilter} onValueChange={setPaidFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Leave Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leave Types</SelectItem>
                <SelectItem value="paid">Paid Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            Showing {filteredLeaves.length} of {leaves.length} leave applications
          </span>
        </div>
      </div>

      {/* Leave Applications */}
      <div className="grid gap-4">
        {filteredLeaves.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave applications found</h3>
              <p className="text-gray-500 text-center">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || paidFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Get started by applying for your first leave'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLeaves.map(leave => (
            <Card key={leave.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1" onClick={() => onLeaveSelect(leave)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : 'Unknown Employee'}
                        </h3>
                        <Badge className={getLeaveTypeColor(leave.leaveType)}>
                          {leave.leaveType}
                        </Badge>
                        <Badge className={`${getStatusColor(leave.status)} flex items-center space-x-1`}>
                          {getStatusIcon(leave.status)}
                          <span>{getStatusDisplayName(leave.status)}</span>
                        </Badge>
                        <Badge className={leave.isPaid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {leave.isPaid ? (
                            <>
                              <DollarSign className="h-3 w-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Ban className="h-3 w-3 mr-1" />
                              Unpaid
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <span>Applied: {formatDate(leave.appliedDate)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{leave.reason}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onLeaveSelect(leave)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {canEditLeave(leave) && (
                        <DropdownMenuItem onClick={() => onLeaveEdit(leave)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDeleteLeave(leave) && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(leave)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Leave Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this leave application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}